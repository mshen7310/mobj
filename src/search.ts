import { Environment } from "./varenv"

export type Walkable = object
export function isWalkable(v: any): v is Walkable {
    return typeof v === 'object'
        && v !== null
        && !(v instanceof Date)
        && !(v instanceof RegExp)
        && !(v instanceof Int8Array)
        && !(v instanceof Uint8Array)
        && !(v instanceof Uint8ClampedArray)
        && !(v instanceof Int16Array)
        && !(v instanceof Uint16Array)
        && !(v instanceof Int32Array)
        && !(v instanceof Uint32Array)
        && !(v instanceof Float32Array)
        && !(v instanceof Float64Array)
        && !(v instanceof DataView)
        && !(v instanceof ArrayBuffer)
        && !(v instanceof Buffer)
        && !(v instanceof ReadableStream)
        && !(v instanceof WritableStream)
        && !(v instanceof TransformStream)
        && !(v instanceof Promise)
}
export type Path = symbol | number | string | WalkerFn
export type Property = any
export type WalkerFn = (value: any, env: Environment) => Property
export type Walker = (value: any, env: Environment) => Generator<Property>


function isPath(p: any): p is Path {
    switch (typeof p) {
        case 'symbol':
        case 'string':
        case 'function':
        case 'number': {
            return true
        }
        default: {
            return false
        }
    }
}

export type ActionFn = (root: any, ...rest: Path[]) => any
const WalkerSymbol = Symbol.for('WalkerSymbol')
export function search(fn: WalkerFn, depth: number = Infinity): Walker {
    function* children(obj: any) {
        if (obj instanceof Map) {
            for (let [k, v] of obj) {
                yield v
            }
        } else if (obj instanceof Set) {
            for (let v of obj) {
                yield v
            }
        } else if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; ++i) {
                yield obj[i]
            }
        } else if (isWalkable(obj)) {
            for (let k of Reflect.ownKeys(obj)) {
                yield obj[k]
            }
        }
    }
    let skip = new WeakSet()
    function* walk(obj: any, env: Environment, dpth: number = depth): Generator<Property> {
        if (!skip.has(obj)) {
            let result = fn(obj, env)
            if (result !== undefined) {
                yield result
            }
            if (typeof obj === 'object' && obj !== null) {
                skip.add(obj)
            }
            if (dpth > 0) {
                for (let child of children(obj)) {
                    yield* walk(child, env, dpth - 1)
                }
            }
        } else {
            // console.log('skip', obj)
        }
    }
    walk[WalkerSymbol] = true
    return walk
}


function toWalker(fieldName: Path): Walker {
    if (typeof fieldName === 'function') {
        // Path is Walker
        return function* (obj: any, env: Environment): Generator<Property> {
            if (fieldName[WalkerSymbol]) {
                yield* fieldName(obj, env);
            } else {
                let ret = fieldName(obj, env)
                if (ret !== undefined) {
                    yield ret
                }
            }
        }
    } else {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj: any, env: Environment): Generator<Property> {
            if (obj instanceof Map) {
                yield obj.get(fieldName)
            } else if (obj !== null && obj !== undefined && Reflect.has(obj, fieldName)) {
                yield obj[fieldName]
            }
        }
    }
}

function walker(...pth: Path[]): Walker {
    let [current, ...rest] = pth
    if (current === undefined) {
        return function* (obj: any, env: Environment): Generator<Property> {
            yield obj
        }
    } else {
        let current_wks = toWalker(current)
        let rest_wks = walker(...rest)
        return function* wk(obj: any, env: Environment): Generator<Property> {
            for (let result of current_wks(obj, env)) {
                if (rest.length > 0) {
                    yield* rest_wks(result, env)
                } else {
                    yield result
                }
            }
        }
    }
}
export function path(act: ActionFn = Array.from): any {
    let all_path = []
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            let not_path: any[] = argumentsList.filter(x => !isPath(x))
            let is_path: Path[] = argumentsList.filter(x => isPath(x))
            all_path = all_path.concat(is_path)
            if (is_path.length > 0 && not_path.length === 0) {
                return retFn
            }
            let w = walker(...all_path)
            all_path = []
            function call_walker(obj: any) {
                let rw = w(obj, new Environment())
                let afrw = act(rw)
                return afrw
            }
            if (is_path.length === 0 && not_path.length === 0) {
                return function (obj: any) {
                    return call_walker(obj)
                }
            } else {
                return call_walker(not_path[0])
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

