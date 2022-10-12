
import { deepEqual } from "./deepEqual";
import { fromGeneratorFn, PassivePath, path, search, setKey } from "./search";

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
export type Difference = {
    path: PassivePath[]
    type: 'missing' | 'redundant' | 'discrepancy'
    expected?: any
    actual?: any
    info?: any
}

export function isDifference(x: any): x is Difference {
    return typeof x === 'object'
        && x !== null
        && Array.isArray(x.path)
        && typeof x.type === 'string'
}
export type DiffFn<T = any> = (...data: T[]) => IterableIterator<Difference>

export function diff<T = any>(pattern): DiffFn<T> {
    const DiffFnSymbol = Symbol.for('DiffFnSymbol')
    if (typeof pattern === 'function' && pattern[DiffFnSymbol]) {
        return pattern
    }
    function shallowEqual(x, y) {
        if (typeof x !== 'function') {
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
    }
    function deepMatch(set: Set<any>, e: object): boolean {
        let p = diff(e)
        for (let element of set) {
            let different = false
            for (let _ of p(element)) {
                different = true
                break
            }
            if (!different) {
                return true
            }
        }
        return false
    }
    function* difffn(...data: any[]) {
        yield* path(a => a)(search(function* (obj, ctx) {
            const peerArray = ctx.accessor()(data[0])
            if (typeof obj === 'function') {
                ctx.skip(obj)
                let tmp = obj(...peerArray)
                if (fromGeneratorFn(tmp)) {
                    for (let rec of tmp) {
                        if (isDifference(rec)) {
                            yield { ...rec, path: ctx.getPassivePath().concat(rec.path) }
                        } else {
                            yield rec
                        }
                    }
                } else if (tmp === false) {
                    if (peerArray.length > 0) {
                        yield {
                            path: ctx.getPassivePath(),
                            type: 'discrepancy',
                            expected: obj,
                            actual: peerArray[0],
                            info: obj.toString()
                        }
                    } else {
                        yield {
                            path: ctx.getPassivePath(),
                            type: 'missing',
                            expected: obj,
                            info: obj.toString()
                        }
                    }
                }
            } else {
                if (peerArray.length === 0) {
                    ctx.skip(obj)
                    yield {
                        path: ctx.getPassivePath(),
                        type: 'missing',
                        expected: obj,
                    }
                } else {
                    const peer = peerArray[0]
                    const equal_primitive = shallowEqual(obj, peer)
                    if (false === equal_primitive) {
                        ctx.skip(obj)
                        yield {
                            path: ctx.getPassivePath(),
                            type: 'discrepancy',
                            expected: obj,
                            actual: peer
                        }
                    } else if (undefined === equal_primitive) {
                        if (obj instanceof Set && peer instanceof Set) {
                            let x_index = 0;
                            for (let xi of obj) {
                                if (!peer.has(xi)) {
                                    if (typeof xi === 'object' && xi !== null) {
                                        if (!deepMatch(peer, xi)) {
                                            yield {
                                                path: ctx.getPassivePath().concat([setKey(x_index)]),
                                                type: 'missing',
                                                expected: xi
                                            }
                                        }
                                    } else {
                                        yield {
                                            path: ctx.getPassivePath().concat([setKey(x_index)]),
                                            type: 'missing',
                                            expected: xi
                                        }
                                    }
                                }
                                x_index++
                            }
                            ctx.skip(obj)
                        }
                    }
                }
            }
        }))()(pattern)
    }
    difffn[DiffFnSymbol] = true
    return difffn
}


export function optional(pattern): DiffFn<Difference> {
    let fn = diff(pattern)
    return function* (...data: any[]) {
        if (data.length > 0) {
            yield* fn(...data)
        }
    }
}

