
import { deepEqual } from "./deepEqual";
import { asGenerator, fromGeneratorFn, PassivePath, path, search, setKey } from "./search";
export type Matcher = (...data: any[]) => boolean;

export type Variable = <T>(...value: T[]) => boolean
export function variable(matcher?: Matcher): Variable {
    let value: any;
    let empty: boolean = true
    matcher = matcher ? matcher : () => true
    function ret<T>(...arg: T[]): boolean {
        if (arg.length === 0) {
            return value
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
    return ret
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
export function match(pattern) {
    const MatchFnSymbol = Symbol.for('MatchFnSymbol')
    if (typeof pattern === 'function' && pattern[MatchFnSymbol]) {
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
        let p = match(e)
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
    function* matchfn(data?: any) {
        yield* path(a => a)(search(function* (obj, ctx) {
            const peerArray = ctx.accessor()(data)
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
    matchfn[MatchFnSymbol] = true
    return matchfn
}
export function optional(pattern) {
    let fn = match(pattern)
    return function* (...data: any[]) {
        if (data.length > 0) {
            yield* fn(...data)
        }
    }
}

export function allOf(...pattern: any[]) {
    let fns = pattern.map(p => match(p))
    return function* allfn(...data: any[]) {
        for (let fn of fns) {
            yield* fn(...data)
        }
    }
}
export function noneOf(...pattern: any[]) {
    let fns = pattern.map(p => match(p))
    return function* nonefn(...data: any[]) {
        for (let fn of fns) {
            let has_diff = false
            for (let _ of fn(...data)) {
                has_diff = true
                break
            }
            if (!has_diff) {
                yield {
                    path: [],
                    type: 'discrepancy',
                    expected: nonefn,
                }
                break
            }
        }
    }
}

export function oneOf(...pattern: any[]) {
    let fns = pattern.map(p => match(p))
    return function* onefn(...data: any[]) {
        let found_one = false
        for (let fn of fns) {
            let has_diff = false
            for (let _ of fn(...data)) {
                has_diff = true
                break
            }
            if (!has_diff) {
                found_one = true
                break
            }
        }
        if (!found_one) {
            yield {
                path: [],
                type: 'discrepancy',
                expected: onefn
            }
        }
    }
}

