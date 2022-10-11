"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.search = exports.fromGeneratorFn = exports.isPassivePath = exports.asGenerator = exports.setKey = exports.isWalkable = exports.Context = exports.isGenerator = void 0;
function isGenerator(fn) {
    return fn !== undefined
        && fn !== null
        && typeof fn === 'object'
        && typeof fn[Symbol.iterator] === 'function';
}
exports.isGenerator = isGenerator;
class Context {
    constructor() {
        this.skip_node = new WeakSet();
        this.path = [];
        this.node = [];
    }
    skip(a) {
        if (typeof a === 'object' && a !== null) {
            this.skip_node.add(a);
        }
    }
    cancel() {
        for (let n of this.node) {
            this.skip(n);
        }
    }
    skipped(a) {
        return this.skip_node.has(a);
    }
    push(node, p) {
        this.node.push(node);
        return this.path.push(p);
    }
    pop() {
        this.node.pop;
        return this.path.pop();
    }
    getPath() {
        return [...this.path];
    }
    getPassivePath() {
        return this.getPath().filter(isPassivePath);
    }
    accessor(n = 0) {
        // filter out function component, 
        // so that it won't call itself recursively
        // when ctx.accessor() is used within the function component
        let tmp = this.getPassivePath();
        if (n > 0) {
            return (obj) => path(Array.from, tmp.slice(0, -n))()(obj);
        }
        else {
            return (obj) => path(Array.from, tmp)()(obj);
        }
    }
}
exports.Context = Context;
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
const SetKeySymbol = Symbol.for('SetKeySymbol');
function setKey(index) {
    return [index, SetKeySymbol];
}
exports.setKey = setKey;
function isSetKey(p) {
    return Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && p[1] === SetKeySymbol;
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
            return isSetKey(p);
        }
        default: {
            // it's fine that the next line is not covered by test case 
            // because non-path object will be taken as the data to search
            // 
            return false;
        }
    }
}
function* asGenerator(result) {
    if (fromGeneratorFn(result)) {
        yield* result;
    }
    else if (result !== undefined) {
        yield result;
    }
}
exports.asGenerator = asGenerator;
function isPassivePath(p) {
    return typeof p !== 'function' && isPath(p);
}
exports.isPassivePath = isPassivePath;
function fromGeneratorFn(x) {
    return isGenerator(x) && !Array.isArray(x) && !(x instanceof Map) && !(x instanceof Set);
}
exports.fromGeneratorFn = fromGeneratorFn;
function search(fn, depth = Infinity) {
    function* children(obj) {
        if (obj instanceof Map) {
            for (let [k, v] of obj) {
                yield [k, v];
            }
        }
        else if (obj instanceof Set) {
            let i = 0;
            for (let v of obj) {
                yield [[i++, SetKeySymbol], v];
            }
        }
        else if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; ++i) {
                yield [i, obj[i]];
            }
        }
        else if (isWalkable(obj)) {
            for (let k of Reflect.ownKeys(obj)) {
                yield [k, obj[k]];
            }
        }
    }
    let skip = new WeakSet();
    return function* walk(obj, ctx, dpth = depth) {
        if (!skip.has(obj)) {
            yield* asGenerator(fn(obj, ctx));
            if (typeof obj === 'object' && obj !== null) {
                skip.add(obj);
            }
            if (dpth > 0 && !ctx.skipped(obj)) {
                for (let [key, child] of children(obj)) {
                    ctx.push(child, key);
                    try {
                        yield* walk(child, ctx, dpth - 1);
                        if (ctx.skipped(obj)) {
                            break;
                        }
                    }
                    finally {
                        ctx.pop();
                    }
                }
            }
        }
    };
}
exports.search = search;
function toWalker(fieldName) {
    if (typeof fieldName === 'function') {
        // Path is Walker
        return function* (obj, ctx) {
            yield* asGenerator(fieldName(obj, ctx));
        };
    }
    else if (isSetKey(fieldName)) {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj, ctx) {
            if (obj instanceof Set) {
                if (fieldName[0] >= 0 && fieldName[0] < obj.size) {
                    yield [...obj][fieldName[0]];
                }
            }
        };
    }
    else {
        // convert Path to a Walker: (any, Environment)=>Generator<Property>
        return function* (obj, ctx) {
            if (obj instanceof Map && obj.has(fieldName)) {
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
            ctx.push(obj, current);
            try {
                for (let r of current_wks(obj, ctx)) {
                    if (rest.length > 0) {
                        //pass the returned value on to the rest function
                        yield* rest_wks(r, ctx);
                    }
                    else {
                        yield r;
                    }
                    if (ctx.skipped(obj)) {
                        break;
                    }
                }
            }
            finally {
                ctx.pop();
            }
        };
    }
}
function path(act = Array.from, all_path = []) {
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            function isData(x) {
                // set key [number, symbol] cannot be specified by . or [] operator 
                // e.g. path()[setKey(2)] is illegal 
                // so set key has to be specified via ()
                return !isSetKey(x) && typeof x !== 'function';
            }
            let not_path = argumentsList.filter(x => isData(x));
            let is_path = argumentsList.filter(x => !isData(x));
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
                return function (obj, ctx = new Context()) {
                    return call_walker(obj, ctx);
                };
            }
            else {
                return call_walker(not_path[0], not_path[1] instanceof Context ? not_path[1] : new Context());
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
