import { deepEqual } from "./equal";
import { Path, path, isPassivePath } from "./search";
import { Matcher } from "./types"

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
    accessor(n: number = 0): (x: any) => any {
        // filter out function component, 
        // so that it won't call itself recursively
        // when ctx.accessor() is used within the function component
        let tmp = this.getPath().filter(isPassivePath)
        if (n > 0) {
            return (obj: any) => path()(...tmp.slice(0, -n))(obj)[0]
        } else {
            return (obj: any) => path()(...tmp)(obj)[0]
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