export function isGenerator(fn: any): fn is Generator {
    return fn !== undefined
        && fn !== null
        && typeof fn === 'object'
        && typeof fn[Symbol.iterator] === 'function'
}
export class Context {
    private readonly skip_node = new WeakSet()
    private readonly path: Path[] = []
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
    push(node: any, p: Path): Path {
        this.node.push(node)
        return this.path.push(p)
    }
    pop(): Path {
        this.node.pop
        return this.path.pop()
    }
    getPath(): Path[] {
        return [...this.path]
    }
    getPassivePath(): PassivePath[] {
        return this.getPath().filter(isPassivePath)
    }
    accessor(n: number = 0): (x: any) => any {
        // filter out function component, 
        // so that it won't call itself recursively
        // when ctx.accessor() is used within the function component
        let tmp = this.getPassivePath()
        if (n > 0) {
            return (obj: any) => path(Array.from, tmp.slice(0, -n))()(obj)
        } else {
            return (obj: any) => path(Array.from, tmp)()(obj)
        }
    }
}


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
export type SetKey = readonly [number, symbol]
export type Path = symbol | number | string | SetKey | WalkerFn
export type PassivePath = Exclude<Path, WalkerFn>
export type Property = any
export type WalkerFn = (value: any, ctx: Context) => Property
export type Walker = (value: any, ctx: Context) => Generator<Property>
const SetKeySymbol = Symbol.for('SetKeySymbol')
export function setKey(index: number): SetKey {
    return [index, SetKeySymbol]
}

function isSetKey(p: any): p is SetKey {
    return Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && p[1] === SetKeySymbol
}
function isPath(p: any): p is Path {
    switch (typeof p) {
        case 'symbol':
        case 'string':
        case 'function':
        case 'number': {
            return true
        }
        case 'object': {
            return isSetKey(p)
        }
        default: {
            // it's fine that the next line is not covered by test case 
            // because non-path object will be taken as the data to search
            // 
            return false
        }
    }
}
export function* asGenerator(result: any) {
    if (fromGeneratorFn(result)) {
        yield* result
    } else if (result !== undefined) {
        yield result
    }
}
export function isPassivePath(p: any): p is Exclude<Path, WalkerFn> {
    return typeof p !== 'function' && isPath(p)
}
export function fromGeneratorFn(x: any): boolean {
    return isGenerator(x) && !Array.isArray(x) && !(x instanceof Map) && !(x instanceof Set)
}
export type ActionFn = (root: any, ...rest: Path[]) => any
export function search(fn: WalkerFn, depth: number = Infinity): Walker {
    function* children(obj: any): Generator<readonly [Exclude<Path, WalkerFn>, any]> {
        if (obj instanceof Map) {
            for (let [k, v] of obj) {
                yield [k, v]
            }
        } else if (obj instanceof Set) {
            let i = 0
            for (let v of obj) {
                yield [[i++, SetKeySymbol], v]
            }
        } else if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; ++i) {
                yield [i, obj[i]]
            }
        } else if (isWalkable(obj)) {
            for (let k of Reflect.ownKeys(obj)) {
                yield [k, obj[k]]
            }
        }
    }
    let visited = new WeakSet()
    return function* walk(obj: any, ctx: Context, dpth: number = depth): Generator<Property> {
        if (!visited.has(obj)) {
            yield* asGenerator(fn(obj, ctx))
            if (typeof obj === 'object' && obj !== null) {
                visited.add(obj)
            }
            if (dpth > 0 && !ctx.skipped(obj)) {
                for (let [key, child] of children(obj)) {
                    ctx.push(child, key)
                    try {
                        yield* walk(child, ctx, dpth - 1)
                        if (ctx.skipped(obj)) {
                            break
                        }
                    } finally {
                        ctx.pop()
                    }
                }
            }
        }
    }
}


function toWalker(fieldName: Path): Walker {
    if (typeof fieldName === 'function') {
        // Path is Walker
        return function* (obj: any, ctx: Context): Generator<Property> {
            yield* asGenerator(fieldName(obj, ctx))
        }
    } else if (isSetKey(fieldName)) {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj: any, ctx: Context): Generator<Property> {
            if (obj instanceof Set) {
                if (fieldName[0] >= 0 && fieldName[0] < obj.size) {
                    yield [...obj][fieldName[0]]
                }
            }
        }
    } else {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj: any, ctx: Context): Generator<Property> {
            if (obj instanceof Map && obj.has(fieldName)) {
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
        return function* (obj: any, ctx: Context): Generator<Property> {
            yield obj
        }
    } else {
        let current_wks = toWalker(current)
        let rest_wks = walker(...rest)
        return function* wk(obj: any, ctx: Context): Generator<Property> {
            ctx.push(obj, current)
            try {
                for (let r of current_wks(obj, ctx)) {
                    if (rest.length > 0) {
                        //pass the returned value on to the rest function
                        yield* rest_wks(r, ctx)
                    } else {
                        yield r
                    }
                    if (ctx.skipped(obj)) {
                        break
                    }
                }
            } finally {
                ctx.pop()
            }
        }
    }
}
export function path(act: ActionFn = Array.from, all_path: Path[] = []): any {
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            function isData(x: any) {
                // set key [number, symbol] cannot be specified by . or [] operator 
                // e.g. path()[setKey(2)] is illegal 
                // so set key has to be specified via ()
                return !isSetKey(x) && typeof x !== 'function'
            }
            let not_path: any[] = argumentsList.filter(x => isData(x))
            let is_path: Path[] = argumentsList.filter(x => !isData(x))
            all_path = all_path.concat(is_path)
            if (is_path.length > 0 && not_path.length === 0) {
                return retFn
            }
            let w = walker(...all_path)
            function call_walker(obj: any, ctx: Context) {
                let rw = w(obj, ctx)
                let afrw = act(rw)
                return afrw
            }
            if (is_path.length === 0 && not_path.length === 0) {
                return function (obj: any, ctx: Context = new Context()) {
                    return call_walker(obj, ctx)
                }
            } else {
                return call_walker(not_path[0], not_path[1] instanceof Context ? not_path[1] : new Context())
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

