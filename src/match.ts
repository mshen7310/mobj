import { diffClass, } from "./context";
import { isWalkable, PassivePath, path, search } from "./search";

export type Difference = {
    path: PassivePath[]
    expected: any
    actual: any
}
function shallowEqual(x, y) {
    if (typeof x !== 'function') {
        if (typeof x !== typeof y) {
            return false
        }
        if (x === y || (Number.isNaN(x) && Number.isNaN(y))) {
            return true
        }
        if (x instanceof Date && y instanceof Date) {
            return x.getTime() === y.getTime()
        }
        if (x instanceof RegExp && y instanceof RegExp) {
            return x.toString() === y.toString()
        }
    }
}

export function match(pattern) {
    return function* (data) {
        yield* path(a => a)(search((obj, ctx) => {
            const peerArray = ctx.accessor()(data)
            if (peerArray.length === 0) {
                //missing field
                return {
                    path: ctx.getPassivePath(),
                    expected: obj,
                }
            }
            const peer = peerArray[0]
            const equal_primitive = shallowEqual(obj, peer)
            if (false === equal_primitive) {
                //primitive and different
                return {
                    path: ctx.getPassivePath(),
                    expected: obj,
                    actual: peer
                }
            }
            if (undefined === equal_primitive) {
                if (typeof obj === 'function') {

                } else {
                    if (diffClass(obj, peer, Set, Map, Array)) {
                        return {
                            path: ctx.getPath(),
                            expected: obj,
                            actual: peer
                        }
                    } else if (obj instanceof Set && peer instanceof Set) {


                    }
                }
            }
        }))()(pattern)
    }
}