

export type GeneratorFn<T = any> = (...arg: any[]) => Generator<T>
export type PredicateFn<T = any> = (arg: T) => boolean
export type TransformFn<T = any, R = any> = (arg: T) => R



export function isGenerator(fn: any): boolean {
    return fn !== undefined
        && fn !== null
        && typeof fn === 'object'
        && typeof fn[Symbol.iterator] === 'function'
}

export function lift(arg: any): GeneratorFn {
    if (isGenerator(arg)) {
        return function* () {
            yield* arg
        }
    } if (typeof arg === 'function') {
        return function* (...anything: any[]) {
            let ret = arg(...anything)
            if (isGenerator(ret)) {
                yield* ret
            } else {
                yield ret
            }
        }
    } else {
        return function* () {
            yield arg
        }
    }
}

export function filter<T = any>(p: PredicateFn<T>): GeneratorFn<T> {
    return function* (gen: any, ...arg: any[]) {
        let g = lift(gen)
        for (let x of g(...arg)) {
            if (p(x)) {
                yield x
            }
        }
    }
}

export function map<T = any, R = any>(t: TransformFn<T, R>): GeneratorFn<R> {
    return function* (gen: any, ...arg: any[]) {
        let g = lift(gen)
        for (let x of g(...arg)) {
            yield t(x)
        }
    }
}
