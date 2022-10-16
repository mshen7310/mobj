import { mapKey, Path, setKey } from "./children"
import { deepEqual } from "./deepEqual"
import { DifferenceType, sameInstance } from "./discriminator"





function inSet(e: any, set: Set<any>): boolean {
    if (set.has(e)) {
        return true
    } else {
        for (let x of set) {
            if (deepEqual(e, x)) {
                return true
            }
        }
        return false
    }
}
export const diffInfo = 'expected = lhs && actual = rhs'
export function* diff(lhs: any, rhs: any, key: Path[] = []) {
    if (lhs !== rhs) {
        const discrepancy = {
            path: key,
            type: DifferenceType.Discrepancy,
            expected: lhs,
            actual: rhs,
            info: diffInfo
        }
        if (typeof lhs !== typeof rhs) {
            yield discrepancy
            return
        }
        switch (typeof lhs) {
            case 'object': {
                if (lhs === null || rhs === null) {
                    yield discrepancy
                } else if (lhs instanceof Date && rhs instanceof Date) {
                    if (lhs.getTime() !== rhs.getTime()) {
                        yield discrepancy
                    }
                } else if (lhs instanceof RegExp && rhs instanceof RegExp) {
                    if (lhs.source !== rhs.source || lhs.flags !== rhs.flags) {
                        yield discrepancy
                    }
                } else if (Array.isArray(lhs) && Array.isArray(rhs)) {
                    let all_keys = [...new Set(Reflect.ownKeys(lhs).concat(Reflect.ownKeys(rhs)))].map(x => typeof x === 'string' ? parseInt(x) : x)
                    for (let k of all_keys) {
                        if (Reflect.has(lhs, k) && Reflect.has(rhs, k)) {
                            yield* diff(lhs[k], rhs[k], [...key, k])
                        } else if (Reflect.has(lhs, k)) {
                            yield {
                                path: [...key, k],
                                type: DifferenceType.Absence,
                                expected: lhs[k],
                                info: diffInfo
                            }
                        } else if (Reflect.has(rhs, k)) {
                            yield {
                                path: [...key, k],
                                type: DifferenceType.Redundancy,
                                actual: rhs[k],
                                info: diffInfo
                            }
                        }
                    }
                } else if (lhs instanceof Set && rhs instanceof Set) {
                    let union = new Set([...lhs, ...rhs])
                    for (let e of union) {
                        const in_rhs = inSet(e, rhs)
                        const in_lhs = inSet(e, lhs)
                        if (in_lhs && !in_rhs) {
                            yield {
                                path: [...key, setKey(e)],
                                type: DifferenceType.Absence,
                                expected: e,
                                info: diffInfo
                            }
                        } else if (!in_lhs && in_rhs) {
                            yield {
                                path: [...key, setKey(e)],
                                type: DifferenceType.Redundancy,
                                actual: e,
                                info: diffInfo
                            }
                        }
                    }
                } else if (lhs instanceof Map && rhs instanceof Map) {
                    let all_keys = new Set([...lhs.keys()].concat([...rhs.keys()]))
                    for (let k of all_keys) {
                        if (lhs.has(k) && rhs.has(k)) {
                            yield* diff(lhs.get(k), rhs.get(k), [...key, mapKey(k)])
                        } else if (lhs.has(k)) {
                            yield {
                                path: [...key, mapKey(k)],
                                type: DifferenceType.Absence,
                                expected: lhs.get(k),
                                info: diffInfo
                            }
                        } else {
                            yield {
                                path: [...key, mapKey(k)],
                                type: DifferenceType.Redundancy,
                                actual: rhs.get(k),
                                info: diffInfo
                            }
                        }
                    }
                } else if (sameInstance(lhs, rhs, Buffer)) {
                    if (Buffer.compare(lhs, rhs) !== 0) {
                        yield discrepancy
                    }
                } else if (sameInstance(lhs, rhs, Int8Array,
                    Uint8Array,
                    Uint8ClampedArray,
                    Int16Array,
                    Uint16Array,
                    Int32Array,
                    Uint32Array,
                    Float32Array,
                    Float64Array,
                    DataView,
                    ArrayBuffer
                )) {
                    if (lhs.length !== rhs.length) {
                        yield discrepancy
                    } else {
                        for (let i = 0; i < lhs.length; ++i) {
                            if (lhs[i] !== rhs[i]) {
                                yield discrepancy
                                break;
                            }
                        }
                    }
                } else {
                    let all_keys = new Set(Reflect.ownKeys(lhs).concat(Reflect.ownKeys(rhs)))
                    for (let k of all_keys) {
                        if (Reflect.has(lhs, k) && Reflect.has(rhs, k)) {
                            yield* diff(lhs[k], rhs[k], [...key, k])
                        } else if (Reflect.has(lhs, k)) {
                            yield {
                                path: [...key, k],
                                type: DifferenceType.Absence,
                                expected: lhs[k],
                                info: diffInfo
                            }
                        } else if (Reflect.has(rhs, k)) {
                            yield {
                                path: [...key, k],
                                type: DifferenceType.Redundancy,
                                actual: rhs[k],
                                info: diffInfo
                            }
                        }
                    }
                }
                break
            }
            case 'number': {
                if (!isNaN(lhs) || !isNaN(rhs)) {
                    yield discrepancy
                }
                break
            }
            default: {
                yield discrepancy
            }
        }
    }
}
