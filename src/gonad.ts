
// function curry(f: Function, arity = f.length, ...args) {
//     return arity <= args.length ? f(...args) : (...argz) => curry(f, arity, ...args, ...argz)
// }
class Context {
    private readonly skip_node = new WeakSet()
    private readonly node: any[] = []
    skip(...a: any[]) {
        let array = a.length === 0 ? this.node : a
        for (let n of array) {
            if (typeof n === 'object' && n !== null) {
                this.skip_node.add(n)
            }
        }
    }
    skipped(a: any): boolean {
        return this.skip_node.has(a)
    }
    push(node: any) {
        return this.node.push(node)
    }
    pop() {
        return this.node.pop()
    }
}

export type Element<P extends Path, V = any> = readonly [
    done: (...obj: any[]) => void,
    path: P[],
    value?: V,
]
export type SetKey<T> = readonly [T, 'SetKey']
export type MapKey<T> = readonly [T, 'MapKey']
export type Path = symbol | number | string | SetKey<any> | MapKey<any>
export function isMapKey(p: any): p is MapKey<any> {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === 'MapKey'
}
export function mapKey<T>(k: T): MapKey<T> {
    return [k, 'MapKey']
}
export function isSetKey(p: any): p is SetKey<any> {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === 'SetKey'
}
export function setKey<T>(v: T): SetKey<T> {
    return [v, 'SetKey']
}


type GenFn<T extends any[], R> = (...input: T) => Generator<R>

type KeyOf<T> = T extends Map<infer K, infer _> ? [K, 'MapKey']
    : T extends Set<infer S> ? [S, 'SetKey']
    : T extends Array<infer _> ? number
    : T extends Object ? string | symbol
    : never

type ValueOfMap<Key, V> = Key extends MapKey<Key> ? V : never
type ValueOfSet<Key, V> = Key extends SetKey<V> ? V : never
type ValueOfArray<Key, V> = Key extends number ? V : never
type ValueOfObject<Key, T> = Key extends keyof T ? T[Key] : never
type ValueOf<T extends object, Key extends Path> = T extends Map<infer _, infer V> ? ValueOfMap<Key, V>
    : T extends Set<infer V> ? ValueOfSet<Key, V>
    : T extends Array<infer V> ? ValueOfArray<Key, V>
    : ValueOfObject<Key, T>


type GenChild<T = any> = GenFn<T[], readonly [KeyOf<T>, any, boolean?]>
type GetResult<T extends object, P extends Path> = T | ValueOf<T, P>
export type SetGetter<T = any, R = any> = (e: T, set: Set<T>) => readonly [R?]
export function getter<P extends Path, T extends object>(set_getter: SetGetter, ...path: P[]): (obj: T) => readonly [GetResult<T, P>?] {
    function get<P extends Path, T extends object>(path: P, obj: T): readonly [ValueOf<T, P>?] {
        if (obj instanceof Map && isMapKey(path) && obj.has(path[0])) {
            return [obj.get(path[0])]
        } else if (obj instanceof Set && isSetKey(path)) {
            if (obj.has(path[0])) {
                return [path[0]]
            } else if (typeof path[0] === 'object' && path[0] !== null) {
                return set_getter(path[0], obj)
            } else {
                return []
            }
        } else if (obj !== null && obj !== undefined && !isSetKey(path) && !isMapKey(path) && Reflect.has(obj, path)) {
            return [obj[path as Exclude<Path, SetKey<any> | MapKey<any>>]]
        } else {
            return []
        }
    }
    return (obj: T) => {
        if (path.length === 0) {
            return [obj]
        } else {
            let [p, ...rest] = path
            let tmp = get(p, obj)
            if (tmp.length === 0) {
                return []
            } else {
                let rest_get = getter(set_getter, ...rest)
                return rest_get(tmp[0]) as readonly [GetResult<T, P>?]
            }
        }
    }
}

export function iterators(...args: (GenChild | readonly [any, GenChild])[]) {
    let ret = new Map<any, any>([
        [Map, function* map_iterator(map: Map<any, any>) {
            for (let [k, v] of map) {
                yield [mapKey(k), v, true]
            }
        }],
        [Set, function* set_iterator(set: Set<any>) {
            for (let v of set) {
                yield [setKey(v), v, true]
            }
        }],
        [Array, function* array_iterator(array: Array<any>) {
            let i = 0
            for (let v of array) {
                yield [i++, v, true]
            }
        }],
        [Object, function* object_iterator(obj: object) {
            for (let k of Reflect.ownKeys(obj)) {
                yield [k, obj[k], true]
            }
        }]
    ])
    let fallback = args.filter(x => !Array.isArray(x)) as GenChild[]
    let tmp = args.filter(Array.isArray) as (readonly [any, GenChild])[]
    for (let [cons, gen] of tmp) {
        ret.set(cons, gen)
    }
    return function* (...objs: any[]) {
        if (objs.length > 0) {
            let obj = objs[0]
            if (typeof obj === 'object' && obj !== null && obj !== undefined) {
                let gen = ret.get(obj.constructor)
                if (gen !== undefined) {
                    yield* gen(...objs)
                    return
                }
            }
            if (fallback.length > 0) {
                yield* fallback[0](...objs)
            } else if (obj !== null && obj !== undefined && !obj.constructor) {
                for (let k of Reflect.ownKeys(obj)) {
                    yield [k, obj[k], true]
                }
            }
        }
    }
}
export type ElementGenerator<T extends any[], V = any> = (...objects: T) => Generator<Element<Path, V>>


const default_iterator = iterators()
export function children(depth: number = Infinity, ite = default_iterator): ElementGenerator<any> {
    return function* (...objects: any[]): Generator<Element<Path>> {
        let visited = new WeakSet()
        let ctx = new Context()
        function* walk(path: Path[], dpth: number, ...args: any[]): Generator<Element<Path>> {
            const done = (...x) => {
                // console.log('done', ...x)
                ctx.skip(...x)
            }
            if (args.length > 0 && !visited.has(args[0])) {
                let obj = args[0]
                if (typeof obj === 'object' && obj !== null) {
                    visited.add(obj)
                }
                yield [done, path, obj]
                if (dpth > 0 && !ctx.skipped(obj)) {
                    for (let [key, child, should_search] of ite(obj)) {
                        if (should_search) {
                            ctx.push(child)
                            try {
                                yield* walk([...path, key], dpth - 1, child)
                            } finally {
                                ctx.pop()
                            }
                        } else {
                            yield [done, [...path, key], child]
                        }
                    }
                }
            }
        }
        yield* walk([], depth, ...objects)
    }
}
