

export type GeneratorFn<T = any> = (...arg: any[]) => Generator<T>
export type PredicateFn<T = any> = (arg: T) => boolean
export type TransformFn<T = any, R = any> = (arg: T) => R
export type TranspredFn<T = any, R = any> = (arg: T) => [R]


export function isGenerator(fn: any): boolean {
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