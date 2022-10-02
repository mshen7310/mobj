

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
                for (let x of ret) {
                    yield x
                }
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

export function filter<T>(p: PredicateFn<T>): GeneratorFn<T> {
    return function* (gen: GeneratorFn<T>, ...arg: any[]) {
        let g = lift(gen)
        for (let x of g(...arg)) {
            if (p(x)) {
                yield x
            }
        }
    }
}

export function map<T, R>(t: TransformFn<T, R>): GeneratorFn<R> {
    return function* (gen: GeneratorFn<T>, ...arg: any[]) {
        let g = lift(gen)
        for (let x of g(...arg)) {
            yield t(x)
        }
    }
}
function isWalkable(v: any): boolean {
    return typeof v === 'object' && v !== null && !(v instanceof Date) && !(v instanceof RegExp)
}

export interface Property {
    value: any
    key?: any
    parent?: any
}

export function* from(arg?: any): Generator<Property> {
    switch (typeof arg) {
        case 'object': {
            if (arg instanceof Map) {
                for (let [k, v] of arg) {
                    yield { value: v, key: k, parent: arg }
                }
                break;
            } else if (arg instanceof Set) {
                for (let v of arg) {
                    yield { value: v, parent: arg }
                }
                break;
            } else if (Array.isArray(arg)) {
                for (let i = 0; i < arg.length; ++i) {
                    yield { value: arg[i], key: i, parent: arg }
                }
                break;
            } else if (isWalkable(arg)) {
                for (let k of Reflect.ownKeys(arg)) {
                    yield { value: arg[k], key: k, parent: arg }
                }
                break;
            }
        }
        default: {
            yield { value: arg }
        }
    }
}