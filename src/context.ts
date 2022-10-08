import { deepEqual } from "./equal";
import { Path, path, WalkerFn } from "./search";
import { Matcher } from "./types"

export type Variable = (...value: any[]) => any


export function variable(matcher?: Matcher): Variable {
    let value: any;
    let empty: boolean = true
    matcher = matcher ? matcher : () => true
    function ret(...arg: any[]) {
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
type ContextPath = Exclude<Path, WalkerFn>
export class Context {
    private readonly registry = new Map<string, Matcher>()
    private readonly path: ContextPath[] = []
    push(p: ContextPath): ContextPath {
        return this.path.push(p)
    }
    pop(): ContextPath {
        return this.path.pop()
    }
    getPath(): ContextPath[] {
        return [...this.path]
    }
    accessor(n: number = 0): (x: any) => any {
        if (n > 0) {
            return (obj: any) => path()(...this.path.slice(0, -n))(obj)[0]
        } else {
            return (obj: any) => path()(...this.path)(obj)[0]
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