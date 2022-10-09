import { path, search } from "./search";


const sameValueZero = (x, y) => x === y || (Number.isNaN(x) && Number.isNaN(y));



export function deepEqual(x, y): boolean {
    function equal(x, y) {
        if (sameValueZero(x, y)) {
            return true
        }
        if (typeof x !== typeof y || typeof x !== 'object') {
            return false;
        }
        if (x instanceof Date && y instanceof Date) {
            return x.getTime() === y.getTime()
        } else if (x instanceof RegExp && y instanceof RegExp) {
            return x.toString() === y.toString()
        }
    }
    let p = path()(search((obj, ctx) => {
        let peer = ctx.accessor()(y)
        let equal_primitive = equal(obj, peer)
        if (false === equal_primitive) {
            ctx.cancel()
            return false
        } else if (undefined === equal_primitive) {
            if (obj instanceof Set && peer instanceof Set) {
                if (obj.size !== peer.size) {
                    ctx.cancel()
                    return false
                } else {
                    for (let xi of obj) {
                        if (!peer.has(xi)) {
                            ctx.cancel()
                            return false
                        }
                    }
                    ctx.skip(obj)
                }
            } else if (obj instanceof Map && peer instanceof Map) {
                if (obj.size !== peer.size) {
                    ctx.cancel()
                    return false
                }
            } else if (Array.isArray(obj) && Array.isArray(peer)) {
                if (obj.length !== peer.length) {
                    ctx.cancel()
                    return false
                }
            } else {
                let x_keys = Reflect.ownKeys(obj)
                let y_keys = Reflect.ownKeys(peer)
                if (x_keys.length !== y_keys.length) {
                    ctx.cancel()
                    return false
                }
            }
        }
    }))()
    return p(x).length === 0
}