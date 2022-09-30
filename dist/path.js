"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.get = exports.descendant = void 0;
const WalkerSymbol = Symbol.for('WalkerSymbol');
function descendant(fn = (value, path, root) => value, depth = 1) {
    function* walk(v, p, r) {
        let value = fn(v, p, r);
        if (value === undefined) {
            yield {
                path: []
            };
        }
        else if (typeof depth === 'number' && depth > 1) {
            for (let tmp of descendant(fn, depth - 1)(value)) {
                yield {
                    value: tmp.value,
                    path: [p, ...tmp.path],
                    root: value
                };
            }
        }
        else {
            yield {
                value,
                path: [p],
                root: r
            };
        }
    }
    let retFn = function* (obj) {
        switch (typeof obj) {
            case 'object': {
                if (obj instanceof Map) {
                    for (let [k, v] of obj) {
                        yield* walk(v, k, obj);
                    }
                }
                else if (obj instanceof Set) {
                    for (let v of obj) {
                        yield* walk(v, undefined, obj);
                    }
                }
                else if (Array.isArray(obj)) {
                    for (let k = 0; k < obj.length; ++k) {
                        yield* walk(obj[k], k, obj);
                    }
                }
                else if (obj !== null
                    && !(obj instanceof Date)
                    && !(obj instanceof RegExp)) {
                    for (let k of Reflect.ownKeys(obj)) {
                        yield* walk(obj[k], k, obj);
                    }
                }
                else {
                    yield {
                        value: fn(obj),
                        path: []
                    };
                }
                break;
            }
            default: {
                yield {
                    value: fn(obj),
                    path: []
                };
            }
        }
    };
    retFn[WalkerSymbol] = true;
    return retFn;
}
exports.descendant = descendant;
function isWalker(fn) {
    return typeof fn === 'function' && fn[WalkerSymbol] === true;
}
function* get(obj, ...path) {
    if (obj === null) {
        yield { value: null, path: [] };
    }
    else if (obj !== undefined) {
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
                                };
                            }
                        }
                    }
                }
                else {
                    throw Error(`${current} is an invalid path component`);
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
                    };
                }
                break;
            }
            case 'undefined': {
                yield { value: obj, path: [] };
                break;
            }
        }
    }
}
exports.get = get;
function path(...P) {
    let all_path = [...P];
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            if (argumentsList.length > 0) {
                all_path = all_path.concat(argumentsList.map(x => {
                    if (!isWalker(x) && typeof x === 'function') {
                        return descendant(x);
                    }
                    return x;
                }));
                return retFn;
            }
            else {
                let ret = all_path;
                all_path = [...P];
                function Fn(obj) {
                    return Array.from(get(obj, ...ret));
                }
                Fn['path'] = [...ret];
                return Fn;
            }
        },
        get(_target, prop, receiver) {
            if (typeof prop === 'string') {
                let i = parseInt(prop);
                all_path.push(isNaN(i) ? prop : i);
            }
            else {
                all_path.push(prop);
            }
            return receiver;
        }
    });
    return retFn;
}
exports.path = path;
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
    };
    let p = path(1);
    let x = p.hello.world();
    console.log(1, Array.from(x(data)));
    p = path();
    let y = p.work.kkk('hello', (v, k, p) => {
        if (k === 'world') {
            return { a: 1, b: 2 };
        }
    }).b((v) => v * 2)();
    console.log(2, y, y(), y(data));
}
