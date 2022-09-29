
export type PropertyWalker = (value: any) => Generator<any[]>
export type PathItem = string | number | symbol | PropertyWalker
export type Path = PathItem[]

export type MapFilterFn = (value: any, key?: any, parent?: any) => [any, any, any] | undefined
const PropertyWalkerSymbol = Symbol.for('PropertyWalkerSymbol')
export function descendant(fn: MapFilterFn = (v, k, p) => [v, k, p], depth: number | any = 1) {
    let retFn = function* (value: any): Generator<any[]> {
        switch (typeof value) {
            case 'object': {
                if (value instanceof Map) {
                    for (let [k, v] of value) {
                        let [fv, fk, fp] = [].concat(fn(v, k, value))
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1)
                            yield* walk(fv)
                        } else {
                            yield [fv, fk, fp]
                        }
                    }
                } else if (value instanceof Set) {
                    for (let v of value) {
                        let [fv, fk, fp] = [].concat(fn(v, undefined, value))
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1)
                            yield* walk(fv)
                        } else {
                            yield [fv, fk, fp]
                        }
                    }
                } else if (Array.isArray(value)) {
                    for (let k = 0; k < value.length; ++k) {
                        let [fv, fk, fp] = [].concat(fn(value[k], k, value))
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1)
                            yield* walk(fv)
                        } else {
                            yield [fv, fk, fp]
                        }
                    }
                } else if (value !== null) {
                    for (let k of Reflect.ownKeys(value)) {
                        let [fv, fk, fp] = [].concat(fn(value[k], k, value))
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1)
                            yield* walk(fv)
                        } else {
                            yield [fv, fk, fp]
                        }
                    }
                } else {
                    yield [].concat(fn(value))
                }
                break
            }
            default: {
                yield [].concat(fn(value))
            }
        }
    }
    retFn[PropertyWalkerSymbol] = true
    return retFn;
}

function isPathWalker(fn: any) {
    return typeof fn === 'function' && fn[PropertyWalkerSymbol] === true
}

export function* get(obj: any, ...path: Path) {
    if (obj !== undefined && obj !== null) {
        let [current, ...rest] = path;
        switch (typeof current) {
            case 'function': {
                if (isPathWalker(current)) {
                    for (let [v, _k, _p] of current(obj)) {
                        if (v !== undefined) {
                            yield* get(v, ...rest)
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
                yield* get(obj[current], ...rest)
                break;
            }
            case 'undefined': {
                yield obj
                break;
            }
        }
    }
    return obj;
}

export function path(...P: Path): any {
    let all_path = [...P]
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            if (argumentsList.length > 0) {
                all_path = all_path.concat(argumentsList.map(x => {
                    if (!isPathWalker(x) && typeof x === 'function') {
                        return descendant(x)
                    }
                    return x;
                }))
                return retFn
            } else {
                let ret = all_path
                all_path = [...P]
                let Fn = function (obj: any) { return get(obj, ...ret) }
                Fn['path'] = [...ret]
                Fn.prototype.toString = function () {
                    return `Path<${ret.toString()}>(object: any): any`
                }
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
    let p = path(1)
    let x = p.hello.world()
    console.log(1, Array.from(x(data)))
    p = path()
    let y = p.work.kkk('hello', (v, k, p) => {
        if (k === 'world') {
            return [v, k, p]
        } else {
            return []
        }
    }).d[0]()
    console.log(2, y, Array.from(y(data)))
}