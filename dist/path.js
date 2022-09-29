"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.get = exports.descendant = void 0;
const PropertyWalkerSymbol = Symbol.for('PropertyWalkerSymbol');
function descendant(fn = (v, k, p) => [v, k, p], depth = 1) {
    let retFn = function* (value) {
        switch (typeof value) {
            case 'object': {
                if (value instanceof Map) {
                    for (let [k, v] of value) {
                        let [fv, fk, fp] = [].concat(fn(v, k, value));
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1);
                            yield* walk(fv);
                        }
                        else {
                            yield [fv, fk, fp];
                        }
                    }
                }
                else if (value instanceof Set) {
                    for (let v of value) {
                        let [fv, fk, fp] = [].concat(fn(v, undefined, value));
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1);
                            yield* walk(fv);
                        }
                        else {
                            yield [fv, fk, fp];
                        }
                    }
                }
                else if (Array.isArray(value)) {
                    for (let k = 0; k < value.length; ++k) {
                        let [fv, fk, fp] = [].concat(fn(value[k], k, value));
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1);
                            yield* walk(fv);
                        }
                        else {
                            yield [fv, fk, fp];
                        }
                    }
                }
                else if (value !== null) {
                    for (let k of Reflect.ownKeys(value)) {
                        let [fv, fk, fp] = [].concat(fn(value[k], k, value));
                        if (fv !== undefined && typeof depth === 'number' && depth > 1) {
                            let walk = descendant(fn, depth - 1);
                            yield* walk(fv);
                        }
                        else {
                            yield [fv, fk, fp];
                        }
                    }
                }
                else {
                    yield [].concat(fn(value));
                }
                break;
            }
            default: {
                yield [].concat(fn(value));
            }
        }
    };
    retFn[PropertyWalkerSymbol] = true;
    return retFn;
}
exports.descendant = descendant;
function isPathWalker(fn) {
    return typeof fn === 'function' && fn[PropertyWalkerSymbol] === true;
}
function* get(obj, ...path) {
    if (obj !== undefined && obj !== null) {
        let [current, ...rest] = path;
        switch (typeof current) {
            case 'function': {
                if (isPathWalker(current)) {
                    for (let [v, _k, _p] of current(obj)) {
                        if (v !== undefined) {
                            yield* get(v, ...rest);
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
                yield* get(obj[current], ...rest);
                break;
            }
            case 'undefined': {
                yield obj;
                break;
            }
        }
    }
    return obj;
}
exports.get = get;
function path(...P) {
    let all_path = [...P];
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            if (argumentsList.length > 0) {
                all_path = all_path.concat(argumentsList.map(x => {
                    if (!isPathWalker(x) && typeof x === 'function') {
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
            return [{ a: 1, b: 2 }, k, p];
        }
        else {
            return [];
        }
    }).b((v) => v * 2)();
    console.log(2, y, y(), y(data));
}
