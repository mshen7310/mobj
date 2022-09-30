"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.descendant = exports.identical = void 0;
function identical(value) {
    return [value];
}
exports.identical = identical;
const WalkerSymbol = Symbol.for('WalkerSymbol');
function isWalker(fn) {
    return typeof fn === 'function' && fn[WalkerSymbol] === true;
}
function isWalkable(v) {
    return typeof v === 'object' && v !== null && !(v instanceof Date) && !(v instanceof RegExp);
}
function assertMapFilter(array, ...location) {
    if (array !== undefined && !(Array.isArray(array) && array.length === 1)) {
        let fn = location.map(x => x.toString()).join(' ');
        let err = new TypeError(`Invalid result of MapFilter, should return "undefined | [any]"`);
        err['MapFilter'] = fn;
        err['return'] = array;
        throw err;
    }
    return array;
}
function* walk(depth, fn, v, p, r) {
    let array = assertMapFilter(fn(v, p, r), fn);
    if (array != undefined) {
        yield {
            value: array[0],
            path: [p],
            root: r
        };
    }
    if (depth === Infinity || depth > 1) {
        // continue the search from new_root's descendants
        // if the current data item(v) didn't pass the filter(array === undefined), try it's descendants
        // if the current data item(v) did pass the filter(array !== undefined), try the descendants of the mapped data item(array[0])
        // if the mapped data item(array[0]) is not walkable, then try the current data item(v)
        let new_root = array === undefined ? v : isWalkable(array[0]) ? array[0] : v;
        // proceed when new_root is walkable and new_root is not the parent
        if (isWalkable(new_root) && new_root !== r) {
            for (let tmp of descendant(fn, depth - 1)(new_root)) {
                yield {
                    value: tmp.value,
                    path: [p, ...tmp.path],
                    root: new_root
                };
            }
        }
    }
}
function descendant(fn = identical, depth = 1) {
    let retFn = function* (obj) {
        if (isWalkable(obj)) {
            if (obj instanceof Map) {
                for (let [k, v] of obj) {
                    yield* walk(depth, fn, v, k, obj);
                }
            }
            else if (obj instanceof Set) {
                for (let v of obj) {
                    yield* walk(depth, fn, v, undefined, obj);
                }
            }
            else if (Array.isArray(obj)) {
                for (let k = 0; k < obj.length; ++k) {
                    yield* walk(depth, fn, obj[k], k, obj);
                }
            }
            else {
                for (let k of Reflect.ownKeys(obj)) {
                    yield* walk(depth, fn, obj[k], k, obj);
                }
            }
        }
        else {
            let array = assertMapFilter(fn(obj), fn);
            if (array !== undefined) {
                yield {
                    value: array[0],
                    path: []
                };
            }
        }
    };
    retFn[WalkerSymbol] = true;
    return retFn;
}
exports.descendant = descendant;
function* get(obj, ...path) {
    if (obj !== undefined) {
        let [current, ...rest] = path;
        switch (typeof current) {
            case 'function': {
                for (let { value, path } of current(obj)) {
                    if (value !== undefined) {
                        // if the intermedia data item(value) is not undefined
                        // handle the rest component of path after 'current' function call
                        for (let tmp of get(value, ...rest)) {
                            yield {
                                value: tmp.value,
                                path: [...path, ...tmp.path]
                            };
                        }
                    }
                    else if (rest.length === 0) {
                        yield {
                            value, path
                        };
                    }
                }
                break;
            }
            case 'string':
            case 'symbol':
            case 'number': {
                let new_root = obj[current];
                if (obj instanceof Map) {
                    new_root = obj.get(current);
                }
                for (let tmp of get(new_root, ...rest)) {
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
function path(...P) {
    function convert_MapFilterFn(x) {
        if (!isWalker(x) && typeof x === 'function') {
            return descendant(x);
        }
        return x;
    }
    let all_path = P.map(convert_MapFilterFn);
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            if (argumentsList.length > 0) {
                all_path = all_path.concat(argumentsList.map(convert_MapFilterFn));
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
