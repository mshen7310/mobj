import { deepEqual } from "./deepEqual";
import { children, fromGeneratorFn, getter, Path } from "./children";

export type Predicate<T = any> = (...data: T[]) => boolean
export interface Variable<T = any> {
    (...value: T[]): boolean
    readonly value: T
    readonly empty: boolean
}

export function variable<T = any>(matcher?: Predicate<T>): Variable<T> {
    let value: any;
    let empty: boolean = true
    matcher = matcher ? matcher : () => true
    function ret(...arg: T[]): boolean {
        if (arg.length === 0) {
            return
        } else if (empty && matcher(arg[0])) {
            value = arg[0]
            empty = false
            return true
        } else if (!empty) {
            return deepEqual(value, arg[0])
        } else {
            return false
        }
    }
    Object.defineProperty(ret, 'value', {
        get: () => value
    })
    Object.defineProperty(ret, 'empty', {
        get: () => empty
    })
    return ret as Variable<T>
}

export enum DifferenceType {
    Absence = 'absence',
    Redundancy = 'redundancy',
    Discrepancy = 'discrepancy'
}
type Missing = {
    path: Path[]
    type: DifferenceType.Absence
    expected: any
    info?: any
}
type Redundant = {
    path: Path[]
    type: DifferenceType.Redundancy
    actual: any
    info?: any
}
type Discrepancy = {
    path: Path[]
    type: DifferenceType.Discrepancy
    expected: any
    actual: any
    info?: any
}
export type Difference = Missing | Discrepancy
export function isDifference(x: any): x is Difference {
    return typeof x === 'object'
        && x !== null
        && Array.isArray(x.path)
        && typeof x.type === 'string'
}
export type DiffFn<T = any> = (...data: T[]) => Generator<Difference>
export function diffSetElement(e: any, set: Set<any>): readonly [any?] {
    let ptn = discriminator(e)
    for (let from_set of set) {
        let different = false
        for (let _ of ptn(from_set)) {
            different = true
            break;
        }
        if (!different) {
            return [from_set]
        }
    }
    return []
}
export function discriminator(pattern: any, set_getter = diffSetElement): DiffFn {
    const DiffFnSymbol = Symbol.for('DiffFnSymbol')
    if (typeof pattern === 'function' && pattern[DiffFnSymbol]) {
        return pattern
    }
    function shallowEqual(x, y) {
        if (x instanceof RegExp && typeof y === 'string') {
            return x.test(y)
        }
        if (typeof x !== typeof y) {
            return false
        }
        if (x === y || (Number.isNaN(x) && Number.isNaN(y))) {
            return true
        }
        if (typeof x !== 'object' || x === null || y === null) {
            return false
        }
        if (x instanceof Date && y instanceof Date) {
            return x.getTime() === y.getTime()
        }
        if (x instanceof RegExp && y instanceof RegExp) {
            return x.toString() === y.toString()
        }
        if (x.constructor !== y.constructor) {
            return false
        }
    }
    let walk = children()
    function* difffn(...data: any[]) {
        for (let [done, path, value] of walk(pattern)) {
            const peerArray = getter(set_getter, ...path)(data[0])
            if (typeof value === 'function') {
                let tmp = value(...peerArray)
                if (fromGeneratorFn(tmp)) {
                    for (let rec of tmp) {
                        if (isDifference(rec)) {
                            yield { ...rec, path: path.concat(rec.path) }
                        } else {
                            yield rec
                        }
                    }
                } else if (tmp === false) {
                    if (peerArray.length > 0) {
                        yield {
                            path,
                            type: DifferenceType.Discrepancy,
                            expected: value,
                            actual: peerArray[0],
                            info: value.toString()
                        }
                    } else {
                        yield {
                            path,
                            type: DifferenceType.Absence,
                            expected: value,
                            info: value.toString()
                        }
                    }
                }
            } else {
                if (peerArray.length === 0) {
                    done(value)
                    yield {
                        path,
                        type: DifferenceType.Absence,
                        expected: value,
                    }
                } else {
                    if (false === shallowEqual(value, peerArray[0])) {
                        done(value)
                        yield {
                            path,
                            type: DifferenceType.Discrepancy,
                            expected: value,
                            actual: peerArray[0]
                        }
                    }
                }
            }
        }
    }
    difffn[DiffFnSymbol] = true
    return difffn
}

export function optional(pattern): DiffFn<Difference> {
    let fn = discriminator(pattern)
    return function* (...data: any[]) {
        if (data.length > 0) {
            yield* fn(...data)
        }
    }
}
