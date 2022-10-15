import { children, DoneFn, fromGeneratorFn, getter, isMapKey, isSetKey, Path } from "./children"
import { equalSetElement } from "./deepEqual"

function* asGenerator(a: any): Generator {
    if (fromGeneratorFn(a)) {
        yield* a
    } else if (a !== undefined) {
        yield a
    }
}


type PathComponent = Path | ((obj: any) => any)

export function search(fn: (a: any, path: Path[], done: DoneFn) => any, depth: number = Infinity): (...args: any[]) => Generator {
    let c = children(depth)
    return function* (...objs: any[]) {
        for (let [done, path, value] of c(objs[0])) {
            yield* asGenerator(fn(value, path, done))
        }
    }
}

function walker(...path: PathComponent[]): (...args: any[]) => Generator {
    function toWalkerFn(p: PathComponent): (x: any) => Generator {
        if (typeof p === 'function') {
            return function* (...objs: any[]) {
                if (objs.length > 0) {
                    yield* asGenerator(p(objs[0]))
                }
            }
        } else {
            let get = getter(equalSetElement, p)
            return function* (...objs: any[]) {
                if (objs.length > 0) {
                    // get(objs[0]) return [any?]
                    // yield* to caller directly
                    yield* get(objs[0])
                }
            }
        }
    }
    return function* (...args: any[]) {
        if (args.length > 0) {
            let [current, ...rest] = path
            if (current === undefined) {
                yield args[0]
            } else {
                let fn = toWalkerFn(current)
                let restfn = walker(...rest)
                for (let ret of fn(args[0])) {
                    yield* restfn(ret)
                }
            }
        }
    }
}

export function path(...all_path: PathComponent[]): any {
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            function isData(x: any) {
                // Map/Set key [any, string] cannot be specified by . or [] operator 
                // e.g. path()[setKey(2)] is illegal 
                // so Map/Set key has to be specified via function application
                // number/string/symbol can be specified via . or [], when they are treated
                // as normal data when pass in as function argument
                return !isSetKey(x) && typeof x !== 'function' && !isMapKey(x)
            }
            let not_path: any[] = argumentsList.filter(x => isData(x))
            let is_path: PathComponent[] = argumentsList.filter(x => !isData(x))
            all_path = all_path.concat(is_path)
            if (is_path.length > 0 && not_path.length === 0) {
                return retFn
            }
            let w = walker(...all_path)
            if (is_path.length === 0 && not_path.length === 0) {
                return function (...obj: any[]) {
                    return Array.from(w(...obj))
                }
            } else {
                return Array.from(w(...not_path))
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

