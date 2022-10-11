import { Path, path, isPassivePath, search, WalkerFn, PassivePath } from "./search";
import { Matcher } from "./types"

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

export function deepEqual(x, y): boolean {
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
export class Context {
    private readonly skip_node = new WeakSet()
    private readonly registry = new Map<string, Matcher>()
    private readonly path: Path[] = []
    private readonly node: any[] = []
    skip(a: any) {
        if (typeof a === 'object' && a !== null) {
            this.skip_node.add(a)
        }
    }
    cancel() {
        for (let n of this.node) {
            this.skip(n)
        }
    }
    skipped(a: any): boolean {
        return this.skip_node.has(a)
    }
    push(node: any, p: Path): Path {
        this.node.push(node)
        return this.path.push(p)
    }
    pop(): Path {
        this.node.pop
        return this.path.pop()
    }
    getPath(): Path[] {
        return [...this.path]
    }
    getPassivePath(): PassivePath[] {
        return this.getPath().filter(isPassivePath)
    }
    accessor(n: number = 0): (x: any) => any {
        // filter out function component, 
        // so that it won't call itself recursively
        // when ctx.accessor() is used within the function component
        let tmp = this.getPassivePath()
        if (n > 0) {
            return (obj: any) => path(Array.from, tmp.slice(0, -n))()(obj)
        } else {
            return (obj: any) => path(Array.from, tmp)()(obj)
        }
    }
    var(name?: string | Matcher, matcher?: Matcher): Variable {
        if (typeof name === 'function') {
            matcher = name
            return variable(matcher)
        } else if (typeof name === 'string') {
            if (this.registry.has(name)) {
                return this.registry.get(name)
            } else {
                let v = variable(matcher)
                this.registry.set(name, v)
                return v
            }
        } else {
            return variable()
        }
    }
}