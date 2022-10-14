
// export type GeneratorFn<T = any> = (...arg: any[]) => Generator<T>
// export type PredicateFn<T = any> = (arg: T) => boolean
// export type TransformFn<T = any, R = any> = (arg: T) => R
// export type TranspredFn<T = any, R = any> = (arg: T) => readonly [R] | undefined

// export function isGenerator(fn: any): fn is Generator {
//     return fn !== undefined
//         && fn !== null
//         && typeof fn === 'object'
//         && typeof fn[Symbol.iterator] === 'function'
// }


// export function filter<T = any>(p: PredicateFn<T>): GeneratorFn<T> {
//     return function* (gen: Generator<T>) {
//         for (let x of gen) {
//             if (p(x)) {
//                 yield x
//             }
//         }
//     }
// }

// export function map<T = any, R = any>(t: TransformFn<T, R>): GeneratorFn<R> {
//     return function* (gen: Generator<T>) {
//         for (let x of gen) {
//             yield t(x)
//         }
//     }
// }

// export function mapFilter<T = any, R = any>(fn: TranspredFn<T, R>): GeneratorFn<R> {
//     return function* (gen: Generator<T>) {
//         for (let x of gen) {
//             let array = fn(x)
//             if (Array.isArray(array) && array.length === 1) {
//                 yield array[0]
//             }
//         }
//     }
// }

// function bind<A = any, B = any>(fn1: GeneratorFn<A>, fn2: GeneratorFn<B>): GeneratorFn<B> {
//     return function* (gen: Generator) {
//         yield* fn2(fn1(gen))
//     }
// }
// export function chain(...fn: GeneratorFn[]): GeneratorFn {
//     let [f, ...rest] = fn
//     if (typeof f === 'function') {
//         if (rest.length > 0) {
//             return bind(f, chain(...rest))
//         } else {
//             return f
//         }
//     } else if (rest.length > 0) {
//         return chain(...rest)
//     } else {
//         return function* (gen: Generator) {
//             yield* gen
//         }
//     }
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

export type Element = readonly [
    done: (...obj: any[]) => void,
    path: Path[],
    value?: any,
]
export type SetKey = readonly [any, 'SetKey']
export type MapKey = readonly [any, 'MapKey']
export type Path = symbol | number | string | SetKey | MapKey
export function isMapKey(p: any): p is MapKey {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === 'MapKey'
}
export function mapKey(k: any): MapKey {
    return [k, 'MapKey']
}
export function isSetKey(p: any): p is SetKey {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === 'SetKey'
}
export function setKey(v: any): SetKey {
    return [v, 'SetKey']
}

export function isPath(p: any): p is Path {
    switch (typeof p) {
        case 'symbol':
        case 'string':
        case 'number': {
            return true
        }
        case 'object': {
            return isSetKey(p) || isMapKey(p)
        }
        default: {
            return false
        }
    }
}


type GenFn<T extends any[], R> = (...input: T) => Generator<R>

type KeyOf<T> = T extends Map<infer K, infer _> ? [K, 'MapKey']
    : T extends Set<infer S> ? [S, 'SetKey']
    : T extends Array<infer _> ? number
    : T extends Object ? string | symbol
    : never

type GenChild<T = any> = GenFn<T[], readonly [KeyOf<T>, any, boolean?]>



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
            }
        }
    }
}
export type ElementGenerator<T extends any[]> = (...objects: T) => Generator<Element>

export function element(key: Path): ElementGenerator<any> {
    return function* (...objects: any[]): Generator<Element> {
        const done = () => { }
        if (objects.length > 0) {
            let obj = objects[0]
            if (obj instanceof Set && isSetKey(key) && obj.has(key[0])) {
                yield [done, [key], key[0]]
            } else if (obj instanceof Map && isMapKey(key) && obj.has(key[0])) {
                yield [done, [key], obj.get(key[0])]
            } else if (obj !== null && obj !== undefined && Reflect.has(obj, key as Exclude<Path, SetKey | MapKey>)) {
                yield [done, [key], obj[key as Exclude<Path, SetKey | MapKey>]]
            }
        }
    }
}
export function children(depth: number = Infinity, ite = iterators()): ElementGenerator<any> {
    return function* (...objects: any[]): Generator<Element> {
        let visited = new WeakSet()
        let ctx = new Context()
        function* walk(path: Path[], dpth: number, ...args: any[]): Generator<Element> {
            const done = (...x) => ctx.skip(...x)
            if (args.length === 0) {
                yield [done, path]
            } else if (!visited.has(args[0])) {
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
                        if (ctx.skipped(obj)) {
                            break
                        }
                    }
                }
            }
        }
        yield* walk([], depth, ...objects)
    }
}

