"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.search = exports.isWalkable = void 0;
const context_1 = require("./context");
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
function isSetKey(p) {
    return Array.isArray(p) && p.length === 1 && typeof p[0] === 'number';
}
function isPath(p) {
    switch (typeof p) {
        case 'symbol':
        case 'string':
        case 'function':
        case 'number': {
            return true;
        }
        case 'object': {
            return Array.isArray(p) && p.length === 1 && typeof p[0] === 'number';
        }
        default: {
            return false;
        }
    }
}
const WalkerSymbol = Symbol.for('WalkerSymbol');
function search(fn, depth = Infinity) {
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
    let skip = new WeakSet();
    function* walk(obj, ctx, dpth = depth) {
        if (!skip.has(obj)) {
            let result = fn(obj, ctx);
            if (result !== undefined) {
                yield result;
            }
            if (typeof obj === 'object' && obj !== null) {
                skip.add(obj);
            }
            if (dpth > 0) {
                for (let child of children(obj)) {
                    yield* walk(child, ctx, dpth - 1);
                }
            }
        }
        else {
            // console.log('skip', obj)
        }
    }
    walk[WalkerSymbol] = true;
    return walk;
}
exports.search = search;
function toWalker(fieldName) {
    if (typeof fieldName === 'function') {
        // Path is Walker
        return function* (obj, ctx) {
            if (fieldName[WalkerSymbol]) {
                yield* fieldName(obj, ctx);
            }
            else {
                let ret = fieldName(obj, ctx);
                if (ret !== undefined) {
                    yield ret;
                }
            }
        };
    }
    else if (isSetKey(fieldName)) {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj, ctx) {
            if (obj instanceof Set) {
                yield [...obj][fieldName[0]];
            }
        };
    }
    else {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj, ctx) {
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
        return function* (obj, ctx) {
            yield obj;
        };
    }
    else {
        let current_wks = toWalker(current);
        let rest_wks = walker(...rest);
        return function* wk(obj, ctx) {
            for (let result of current_wks(obj, ctx)) {
                if (rest.length > 0) {
                    yield* rest_wks(result, ctx);
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
            function call_walker(obj, ctx) {
                let rw = w(obj, ctx);
                let afrw = act(rw);
                return afrw;
            }
            if (is_path.length === 0 && not_path.length === 0) {
                return function (obj, ctx = new context_1.Context()) {
                    return call_walker(obj, ctx);
                };
            }
            else {
                return call_walker(not_path[0], not_path[1] instanceof context_1.Context ? not_path[1] : new context_1.Context());
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
