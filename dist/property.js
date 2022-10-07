"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.search = exports.isWalkable = void 0;
const environment_1 = require("./environment");
function isWalkable(v) {
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
        && !(v instanceof Promise);
}
exports.isWalkable = isWalkable;
function isPath(p) {
    switch (typeof p) {
        case 'symbol':
        case 'string':
        case 'function':
        case 'number': {
            return true;
        }
        default: {
            return false;
        }
    }
}
const SearchWalkerSymbol = Symbol.for('SearchWalkerSymbol');
function search(fn) {
    function* children(obj) {
        if (obj instanceof Map) {
            for (let [k, v] of obj) {
                yield v;
            }
        }
        else if (obj instanceof Set) {
            for (let v of obj) {
                yield v;
            }
        }
        else if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; ++i) {
                yield obj[i];
            }
        }
        else if (isWalkable(obj)) {
            for (let k of Reflect.ownKeys(obj)) {
                yield obj[k];
            }
        }
    }
    function* walk(obj, env) {
        let result = fn(obj, env);
        if (result !== undefined) {
            yield result;
        }
        for (let child of children(obj)) {
            yield* walk(child, env);
        }
    }
    walk[SearchWalkerSymbol] = true;
    return walk;
}
exports.search = search;
function toWalker(fieldName) {
    if (typeof fieldName === 'function') {
        // Path is Walker
        return function* (obj, env) {
            let ret = fieldName(obj, env);
            if (fieldName[SearchWalkerSymbol]) {
                yield* ret;
            }
            else if (ret !== undefined) {
                yield ret;
            }
        };
    }
    else {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj, env) {
            if (obj instanceof Map) {
                yield obj.get(fieldName);
            }
            else if (obj !== null && obj !== undefined && Reflect.has(obj, fieldName)) {
                yield obj[fieldName];
            }
        };
    }
}
function walker(...pth) {
    let [current, ...rest] = pth;
    if (current === undefined) {
        return function* (obj, env) {
            yield obj;
        };
    }
    else {
        let current_wks = toWalker(current);
        let rest_wks = walker(...rest);
        return function* wk(obj, env) {
            for (let result of current_wks(obj, env)) {
                if (rest.length > 0) {
                    yield* rest_wks(result, env);
                }
                else {
                    yield result;
                }
            }
        };
    }
}
function path(act = Array.from) {
    let all_path = [];
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            let not_path = argumentsList.filter(x => !isPath(x));
            let is_path = argumentsList.filter(x => isPath(x));
            all_path = all_path.concat(is_path);
            if (is_path.length > 0 && not_path.length === 0) {
                return retFn;
            }
            let w = walker(...all_path);
            all_path = [];
            function call_walker(obj) {
                let rw = w(obj, new environment_1.Environment());
                let afrw = act(rw);
                return afrw;
            }
            if (is_path.length === 0 && not_path.length === 0) {
                return function (obj) {
                    return call_walker(obj);
                };
            }
            else {
                return call_walker(not_path[0]);
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
