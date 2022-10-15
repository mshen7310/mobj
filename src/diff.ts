import { mapKey, Path, setKey } from "./children"
import { deepEqual } from "./deepEqual"
import { DifferenceType } from "./discriminator"

function isWalkable(v: any): boolean {
    return typeof v === 'object'
        && v !== null
        && !(v instanceof Date)
        && !(v instanceof RegExp)
        && !(v instanceof Int8Array)
        && !(v instanceof Uint8Array)
        && !(v instanceof Uint8ClampedArray)
        && !(v instanceof Int16Array)
        && !(v instanceof Uint16Array)
        && !(v instanceof Int32Array)
        && !(v instanceof Uint32Array)
        && !(v instanceof Float32Array)
        && !(v instanceof Float64Array)
        && !(v instanceof DataView)
        && !(v instanceof ArrayBuffer)
        && !(v instanceof Buffer)
        && !(v instanceof ReadableStream)
        && !(v instanceof WritableStream)
        && !(v instanceof TransformStream)
        && !(v instanceof Promise)
}

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
export function* diff(lhs: any, rhs: any, key: Path[] = []) {
    if (lhs !== rhs) {
        const discrepancy = {
            path: key,
            type: DifferenceType.Discrepancy,
            expected: lhs,
            actual: rhs,
            info: 'expected === lhs && actual === rhs'
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
                            yield* diff(lhs[k], rhs[k], key.concat(k))
                        } else if (Reflect.has(lhs, k)) {
                            yield {
                                path: key.concat(k),
                                type: DifferenceType.Absence,
                                expected: lhs[k],
                                info: 'expected === lhs && actual === rhs'
                            }
                        } else if (Reflect.has(rhs, k)) {
                            yield {
                                path: key.concat(k),
                                type: DifferenceType.Redundancy,
                                actual: lhs[k],
                                info: 'expected === lhs && actual === rhs'
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
                                path: key.concat(setKey(e)),
                                type: DifferenceType.Absence,
                                expected: e,
                                info: 'expected === lhs && actual === rhs'
                            }
                        } else if (!in_lhs && in_rhs) {
                            yield {
                                path: key.concat(setKey(e)),
                                type: DifferenceType.Redundancy,
                                actual: e,
                                info: 'expected === lhs && actual === rhs'
                            }
                        }
                    }
                } else if (lhs instanceof Map && rhs instanceof Map) {
                    let all_keys = new Set([...lhs.keys()].concat([...rhs.keys()]))
                    for (let k of all_keys) {
                        if (lhs.has(k) && rhs.has(k)) {
                            yield* diff(lhs.get(k), rhs.get(k), key.concat(mapKey(k)))
                        } else if (lhs.has(k)) {
                            yield {
                                path: key.concat(mapKey(k)),
                                type: DifferenceType.Absence,
                                expected: lhs.get(k),
                                info: 'expected === lhs && actual === rhs'
                            }
                        } else {
                            yield {
                                path: key.concat(mapKey(k)),
                                type: DifferenceType.Redundancy,
                                actual: rhs.get(k),
                                info: 'expected === lhs && actual === rhs'
                            }
                        }
                    }
                } else if (isWalkable(lhs) && isWalkable(rhs)) {
                    let all_keys = new Set(Reflect.ownKeys(lhs).concat(Reflect.ownKeys(rhs)))
                    for (let k of all_keys) {
                        if (Reflect.has(lhs, k) && Reflect.has(rhs, k)) {
                            yield* diff(lhs[k], rhs[k], key.concat(k))
                        } else if (Reflect.has(lhs, k)) {
                            yield {
                                path: key.concat(k),
                                type: DifferenceType.Absence,
                                expected: lhs[k],
                                info: 'expected === lhs && actual === rhs'
                            }
                        } else if (Reflect.has(rhs, k)) {
                            yield {
                                path: key.concat(k),
                                type: DifferenceType.Redundancy,
                                actual: lhs[k],
                                info: 'expected === lhs && actual === rhs'
                            }
                        }
                    }
                } else {
                    yield discrepancy
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
