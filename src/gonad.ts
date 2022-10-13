export type GeneratorFn<T = any> = (...arg: any[]) => Generator<T>
export type PredicateFn<T = any> = (arg: T) => boolean
export type TransformFn<T = any, R = any> = (arg: T) => R
export type TranspredFn<T = any, R = any> = (arg: T) => readonly [R] | undefined

export function isGenerator(fn: any): fn is Generator {
    return fn !== undefined
        && fn !== null
        && typeof fn === 'object'
        && typeof fn[Symbol.iterator] === 'function'
}


export function filter<T = any>(p: PredicateFn<T>): GeneratorFn<T> {
    return function* (gen: Generator<T>) {
        for (let x of gen) {
            if (p(x)) {
                yield x
            }
        }
    }
}

export function map<T = any, R = any>(t: TransformFn<T, R>): GeneratorFn<R> {
    return function* (gen: Generator<T>) {
        for (let x of gen) {
            yield t(x)
        }
    }
}

export function mapFilter<T = any, R = any>(fn: TranspredFn<T, R>): GeneratorFn<R> {
    return function* (gen: Generator<T>) {
        for (let x of gen) {
            let array = fn(x)
            if (Array.isArray(array) && array.length === 1) {
                yield array[0]
            }
        }
    }
}

function bind<A = any, B = any>(fn1: GeneratorFn<A>, fn2: GeneratorFn<B>): GeneratorFn<B> {
    return function* (gen: Generator) {
        yield* fn2(fn1(gen))
    }
}
export function chain(...fn: GeneratorFn[]): GeneratorFn {
    let [f, ...rest] = fn
    if (typeof f === 'function') {
        if (rest.length > 0) {
            return bind(f, chain(...rest))
        } else {
            return f
        }
    } else if (rest.length > 0) {
        return chain(...rest)
    } else {
        return function* (gen: Generator) {
            yield* gen
        }
    }
}

export class Context {
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

export type SetKey = readonly [number, symbol]
export type MapKey = readonly [any, symbol]
export type Path = symbol | number | string | SetKey | MapKey
const SetKeySymbol = Symbol.for('SetKeySymbol')
const MapKeySymbol = Symbol.for('MapKeySymbol')
export function isMapKey(p: any): p is MapKey {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === MapKeySymbol
}
export function mapKey(k: any): MapKey {
    return [k, MapKeySymbol]
}
export function isSetKey(p: any): p is SetKey {
    return Array.isArray(p)
        && p.length === 2
        && typeof p[0] === 'number'
        && p[1] === SetKeySymbol
}
export function setKey(index: number): SetKey {
    return [index, SetKeySymbol]
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


type GenFn<T, R> = (...input: T[]) => IterableIterator<R>
type GenChild = GenFn<any, readonly [Path, any, boolean?]>

export function iterators(...args: (GenChild | readonly [any, GenChild])[]) {
    let ret = new Map<any, GenChild>([
        [Map, function* map_iterator(map: Map<any, any>) {
            for (let [k, v] of map) {
                yield [[k, MapKeySymbol], v, true]
            }
        }],
        [Set, function* set_iterator(set: Set<any>) {
            let i = 0
            for (let v of set) {
                yield [[i++, SetKeySymbol], v, true]
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

export function children(depth: number = Infinity, ite = iterators()) {
    function* elements(...objects: any[]): IterableIterator<Element> {
        let visited = new WeakSet()
        let ctx = new Context()
        function* walk(path: Path[], dpth: number, ...args: any[]): IterableIterator<Element> {
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
    return elements
}

