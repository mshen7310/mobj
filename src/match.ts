
import { fromGeneratorFn, PassivePath, path, search, setKey } from "./search";
import { Differ } from "./types";

export type Difference = {
    path: PassivePath[]
    type: 'missing' | 'redundant' | 'discrepancy'
    expected?: any
    actual?: any
    info?: any
}
function isDifference(x: any): x is Difference {
    return typeof x === 'object'
        && x !== null
        && Array.isArray(x.path)
        && typeof x.type === 'string'
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
        for (let diff of p(element)) {
            different = true
            break
        }
        if (!different) {
            return true
        }
    }
    return false
}

export function match(pattern) {
    return function* (data?: any) {
        yield* path(a => a)(search(function* (obj, ctx) {
            const peerArray = ctx.accessor()(data)
            // console.log(peerArray, ctx.getPath())
            if (peerArray.length === 0) {
                //missing field
                ctx.skip(obj)
                yield {
                    path: ctx.getPassivePath(),
                    type: 'missing',
                    expected: obj,
                }
            } else {
                const peer = peerArray[0]
                // console.log(shallowEqual(obj, peer), obj, peer)
                const equal_primitive = shallowEqual(obj, peer)
                if (false === equal_primitive) {
                    //primitive and different
                    ctx.skip(obj)
                    yield {
                        path: ctx.getPassivePath(),
                        type: 'discrepancy',
                        expected: obj,
                        actual: peer
                    }
                } else if (undefined === equal_primitive) {
                    if (typeof obj === 'function') {
                        ctx.skip(obj)
                        let tmp = obj(peer)
                        if (fromGeneratorFn(tmp)) {
                            for (let rec of tmp) {
                                if (isDifference(rec)) {
                                    yield { ...rec, path: ctx.getPassivePath().concat(rec.path) }
                                } else {
                                    yield rec
                                }
                            }
                        } else if (tmp === false) {
                            yield {
                                path: ctx.getPassivePath(),
                                type: 'discrepancy',
                                expected: obj,
                                actual: peer,
                                info: obj.toString()
                            }
                        }
                    } else if (obj instanceof Set && peer instanceof Set) {
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
        }))()(pattern)
    }
}