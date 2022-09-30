
// export type Predicate = (...arg: any[]) => boolean
export interface Variable {
    path?: Exclude<PathItem, Walker>[]
    value?: any
    root?: object
}

// export class Env {
//     private readonly env: Map<string, Variable>
//     constructor() {
//         this.env = new Map<string, Variable>()
//     }
//     variable(name: string): Variable {
//         if (!this.env.has(name)) {
//             this.env.set(name, { path: [] })
//         }
//         return this.env.get(name)
//     }
// }
// export function env(): Env {
//     return new Env()
// }

export type Walker = (value: any) => Generator<Variable>
export type PathItem = string | number | symbol | Walker
export type Path = PathItem[]

export type MapFilterFn = (value: any, key?: Exclude<PathItem, Walker>, parent?: any) => any
export function identical(v: any): any {
    return v
}
const WalkerSymbol = Symbol.for('WalkerSymbol')
function isWalkable(v: any): boolean {
    return typeof v === 'object' && v !== null && !(v instanceof Date) && !(v instanceof RegExp)
}

function* walk(depth: number, fn: MapFilterFn, v: any, p: Exclude<PathItem, Walker>, r: any): Generator<Variable> {
    let value = fn(v, p, r)
    if (value !== undefined) {
        yield {
            value,
            path: [p],
            root: r
        }
    }
    if (depth === Infinity || depth > 1) {
        let new_root = isWalkable(value) ? value : v
        if (isWalkable(new_root)) {
            for (let tmp of descendant(fn, depth - 1)(new_root)) {
                yield {
                    value: tmp.value,
                    path: [p, ...tmp.path],
                    root: new_root
                }
            }
        }
    }
}

export function descendant(fn: MapFilterFn = identical, depth: number = 1): (a: any) => Generator<Variable> {
    let retFn = function* (obj: any): Generator<Variable> {
        if (isWalkable(obj)) {
            if (obj instanceof Map) {
                for (let [k, v] of obj) {
                    yield* walk(depth, fn, v, k, obj)
                }
            } else if (obj instanceof Set) {
                for (let v of obj) {
                    yield* walk(depth, fn, v, undefined, obj)
                }
            } else if (Array.isArray(obj)) {
                for (let k = 0; k < obj.length; ++k) {
                    yield* walk(depth, fn, obj[k], k, obj)
                }
            } else if (obj !== null
                && !(obj instanceof Date)
                && !(obj instanceof RegExp)
            ) {
                for (let k of Reflect.ownKeys(obj)) {
                    yield* walk(depth, fn, obj[k], k, obj)
                }
            }
        } else {
            yield {
                value: fn(obj),
                path: []
            }
        }
    }
    retFn[WalkerSymbol] = true
    return retFn;
}

function isWalker(fn: any) {
    return typeof fn === 'function' && fn[WalkerSymbol] === true
}

export function* get(obj: any, ...path: Path): Generator<Variable> {
    if (obj === null) {
        yield { value: null, path: [] }
    } else if (obj !== undefined) {
        let [current, ...rest] = path;
        switch (typeof current) {
            case 'function': {
                if (isWalker(current)) {
                    for (let { value, path } of current(obj)) {
                        if (value !== undefined) {
                            for (let tmp of get(value, ...rest)) {
                                yield {
                                    value: tmp.value,
                                    path: [...path, ...tmp.path]
                                }
                            }
                        }
                    }
                } else {
                    throw Error(`${current} is an invalid path component`)
                }
                break;
            }
            case 'string':
            case 'symbol':
            case 'number': {
                for (let tmp of get(obj[current], ...rest)) {
                    yield {
                        value: tmp.value,
                        path: [current, ...tmp.path]
                    }
                }
                break;
            }
            case 'undefined': {
                yield { value: obj, path: [] }
                break;
            }
        }
    }
}

export function path(...P: Path): any {
    let all_path = [...P]
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            if (argumentsList.length > 0) {
                all_path = all_path.concat(argumentsList.map(x => {
                    if (!isWalker(x) && typeof x === 'function') {
                        return descendant(x)
                    }
                    return x;
                }))
                return retFn
            } else {
                let ret = all_path
                all_path = [...P]
                function Fn(obj: any) {
                    return Array.from(get(obj, ...ret))
                }
                Fn['path'] = [...ret]
                return Fn
            }
        },
        get(_target, prop, receiver) {
            if (typeof prop === 'string') {
                let i = parseInt(prop)
                all_path.push(isNaN(i) ? prop : i)
            } else {
                all_path.push(prop)
            }
            return receiver;
        }
    })
    return retFn;
}

if (require.main == module) {
    const data = {
        hello: {
            world: 'hello world'
        },
        work: {
            kkk: {
                hello: {
                    world: {
                        a: [1, 2, 3],
                        b: ['a', 'b', 'c'],
                        d: [{
                            k: 'k',
                            z: 'z'
                        }]
                    }
                }
            }
        }
    }
    let y = path().work.kkk('hello', (v, k, p) => {
        if (k === 'world') {
            return { a: 1, b: 2 }
        }
    }).b((v) => v * 2)()
    console.log(2, y, y(), y(data))
}