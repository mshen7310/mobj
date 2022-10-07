"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.search = exports.children = exports.from = exports.isWalkable = void 0;
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
function* from(arg) {
    switch (typeof arg) {
        case 'object': {
            if (arg instanceof Map) {
                for (let [k, v] of arg) {
                    yield { value: v, path: [k], root: arg };
                }
                break;
            }
            else if (arg instanceof Set) {
                for (let v of arg) {
                    yield { value: v, path: [], root: arg };
                }
                break;
            }
            else if (Array.isArray(arg)) {
                for (let i = 0; i < arg.length; ++i) {
                    yield { value: arg[i], path: [i], root: arg };
                }
                break;
            }
            else if (isWalkable(arg)) {
                for (let k of Reflect.ownKeys(arg)) {
                    yield { value: arg[k], path: [k], root: arg };
                }
                break;
            }
        }
        default: {
            yield { value: arg, path: [] };
        }
    }
}
exports.from = from;
function children() {
    return function* do_children(obj) {
        if (isWalkable(obj)) {
            yield* from(obj);
        }
        else {
            yield { value: obj, path: [] };
        }
    };
}
exports.children = children;
function search() {
    return function* do_search(obj) {
        if (isWalkable(obj)) {
            for (let property of from(obj)) {
                for (let child of do_search(property.value)) {
                    yield { ...child, path: property.path.concat(child.path), root: obj };
                }
            }
        }
        else {
            yield { value: obj, path: [] };
        }
    };
}
exports.search = search;
function toWalker(fieldName) {
    if (typeof fieldName === 'function') {
        return fieldName;
    }
    else {
        return function* (obj) {
            if (obj !== null && typeof obj === 'object' && Reflect.has(obj, fieldName)) {
                yield { value: obj[fieldName], path: [fieldName], root: obj };
            }
        };
    }
}
function walker(...pth) {
    return function* wk(obj) {
        let [current, ...rest] = pth;
        if (current === undefined) {
            yield { value: obj, path: [] };
        }
        else {
            let current_wks = toWalker(current);
            let rest_wks = walker(...rest);
            for (let { value, path } of current_wks(obj)) {
                for (let x of rest_wks(value)) {
                    yield { ...x, path: path.concat(x.path), root: obj };
                }
            }
        }
    };
}
function get(root, ...rest) {
    let w = walker(...rest);
    return Array.from(w(root));
}
function path(act = get) {
    let all_path = [];
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            if (argumentsList.length > 0) {
                all_path = all_path.concat(argumentsList);
                return retFn;
            }
            else {
                let ret = all_path;
                all_path = [];
                function Fn(obj) {
                    return act(obj, ...ret);
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
