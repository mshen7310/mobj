import { children, getter } from "./children"

export function equalSetElement(e: any, set: Set<any>): readonly [any?] {
    for (let from_set of set) {
        if (deepEqual(e, from_set)) {
            return [from_set]
        }
    }
    return []
}

export function deepEqual(lhs: any, rhs: any, set_getter = equalSetElement): boolean {
    // const dbg = (v, p, ...r) => {
    //     const str = (x) => (x === null || x === undefined) ? `${x}` : x.toString()
    //     console.log(`${str(v)} : ${typeof v} ~~ ${str(p)} : ${typeof p} =>`, ...r)
    // }
    let walk = children()
    for (let [done, path, value] of walk(lhs)) {
        let peerArray = getter(set_getter, ...path)(rhs)
        if (peerArray.length === 0) {
            return false
        }
        let peer = peerArray[0]
        if (typeof value !== typeof peer) {
            // dbg(value, peer, false, 0)
            return false
        }
        if (typeof peer === 'number') {
            if (value !== peer) {
                if (!(isNaN(value) && isNaN(peer))) {
                    // dbg(value, peer, false, 1)
                    return false
                }
            }
        } else if (typeof value !== 'object') {
            if (value !== peer) {
                // dbg(value, peer, false, 2)
                return false
            }
        }
        if (typeof value === 'object' && value !== null && value !== undefined && peer !== null && peer !== undefined) {
            if (value instanceof Date && peer instanceof Date) {
                if (value.getTime() !== peer.getTime()) {
                    // dbg(value, peer, false, 3)
                    return false
                }
            }
            if (value instanceof RegExp && peer instanceof RegExp) {
                if (value.toString() !== peer.toString()) {
                    // dbg(value, peer, false, 4)
                    return false
                }
            }
            if (value.constructor !== peer.constructor) {
                // dbg(value, peer, false, 5)
                return false
            }
            if (value instanceof Map && peer instanceof Map && value.size !== peer.size) {
                // dbg(value, peer, false, 6)
                return false
            }
            if (Array.isArray(value) && Array.isArray(peer) && value.length !== peer.length) {
                // dbg(value, peer, false, 7)
                return false
            }
            if (value instanceof Set && peer instanceof Set && value.size !== peer.size) {
                // dbg(value, peer, false, 8)
                return false
            }
            if (Reflect.ownKeys(value).length !== Reflect.ownKeys(peer).length) {
                // dbg(value, peer, false, 9)
                return false
            }
        }
    }
    return true
}
