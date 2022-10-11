import { path, search } from "./search"

export function deepEqual(x, y): boolean {
    function shallowEqual(x, y) {
        if (x === y || (Number.isNaN(x) && Number.isNaN(y))) {
            return true
        } else if (typeof x !== typeof y || typeof x !== 'object') {
            return false
        } else if (x instanceof Date && y instanceof Date) {
            return x.getTime() === y.getTime()
        } else if (x instanceof RegExp && y instanceof RegExp) {
            return x.toString() === y.toString()
        } else if (x.constructor !== y.constructor) {
            return false
        }
    }
    function deepHas(set: Set<any>, e: object): boolean {
        for (let element of set) {
            if (deepEqual(e, element)) {
                return true
            }
        }
        return false
    }
    const is_equal = shallowEqual(x, y)
    if (is_equal !== undefined) {
        return is_equal
    }
    const p = path()(search((obj, ctx) => {
        const peer = ctx.accessor()(y)[0]
        const equal_primitive = shallowEqual(obj, peer)
        if (false === equal_primitive) {
            ctx.cancel()
            return false
        } else if (undefined === equal_primitive) {
            if (
                (obj instanceof Map && peer instanceof Map && obj.size !== peer.size)
                || (Array.isArray(obj) && Array.isArray(peer) && obj.length !== peer.length)
                || (obj instanceof Set && peer instanceof Set && obj.size !== peer.size)
                || (Reflect.ownKeys(obj).length !== Reflect.ownKeys(peer).length)
            ) {
                ctx.cancel()
                return false
            } else if (obj instanceof Set && peer instanceof Set) {
                for (let xi of obj) {
                    if (!peer.has(xi)) {
                        if (typeof xi === 'object' && xi !== null) {
                            if (deepHas(peer, xi)) {
                                continue
                            }
                        }
                        ctx.cancel()
                        return false
                    }
                }
                ctx.skip(obj)
            }
        }
    }))()
    return p(x).length === 0
}
