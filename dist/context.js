"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.variable = exports.deepEqual = void 0;
const search_1 = require("./search");
function equal(x, y) {
    if (x === y || (Number.isNaN(x) && Number.isNaN(y))) {
        return true;
    }
    else if (typeof x !== typeof y || typeof x !== 'object') {
        return false;
    }
    else if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime();
    }
    else if (x instanceof RegExp && y instanceof RegExp) {
        return x.toString() === y.toString();
    }
}
const diffClass = (a, b, ...cls) => cls.reduce((r, c) => r || (a instanceof c && !(b instanceof c)), false);
function deepHas(set, e) {
    for (let element of set) {
        if (deepEqual(e, element)) {
            return true;
        }
    }
    return false;
}
function deepEqual(x, y) {
    const p = (0, search_1.path)()((0, search_1.search)((obj, ctx) => {
        const peer = ctx.accessor()(y)[0];
        const equal_primitive = equal(obj, peer);
        if (false === equal_primitive) {
            ctx.cancel();
            return false;
        }
        else if (undefined === equal_primitive) {
            if (diffClass(obj, peer, Set, Map, Array)
                || (obj instanceof Map && peer instanceof Map && obj.size !== peer.size)
                || (Array.isArray(obj) && Array.isArray(peer) && obj.length !== peer.length)
                || (obj instanceof Set && peer instanceof Set && obj.size !== peer.size)
                || (Reflect.ownKeys(obj).length !== Reflect.ownKeys(peer).length)) {
                ctx.cancel();
                return false;
            }
            else if (obj instanceof Set && peer instanceof Set) {
                for (let xi of obj) {
                    if (!peer.has(xi)) {
                        if (typeof xi === 'object' && xi !== null) {
                            if (deepHas(peer, xi)) {
                                continue;
                            }
                        }
                        ctx.cancel();
                        return false;
                    }
                }
                ctx.skip(obj);
            }
        }
    }))();
    return p(x).length === 0;
}
exports.deepEqual = deepEqual;
function variable(matcher) {
    let value;
    let empty = true;
    matcher = matcher ? matcher : () => true;
    function ret(...arg) {
        if (arg.length === 0) {
            return value;
        }
        else if (empty && matcher(arg[0])) {
            value = arg[0];
            empty = false;
            return true;
        }
        else if (!empty) {
            return deepEqual(value, arg[0]);
        }
        else {
            return false;
        }
    }
    Object.defineProperty(ret, 'value', {
        get: () => value
    });
    Object.defineProperty(ret, 'empty', {
        get: () => empty
    });
    return ret;
}
exports.variable = variable;
class Context {
    constructor() {
        this.skip_node = new WeakSet();
        this.registry = new Map();
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
    accessor(n = 0) {
        // filter out function component, 
        // so that it won't call itself recursively
        // when ctx.accessor() is used within the function component
        let tmp = this.getPath().filter(search_1.isPassivePath);
        if (n > 0) {
            return (obj) => (0, search_1.path)()(...tmp.slice(0, -n))(obj)[0];
        }
        else {
            return (obj) => (0, search_1.path)()(...tmp)(obj)[0];
        }
    }
    var(name, matcher) {
        if (typeof name === 'function') {
            matcher = name;
            return variable(matcher);
        }
        else if (typeof name === 'string') {
            if (this.registry.has(name)) {
                return this.registry.get(name);
            }
            else {
                let v = variable(matcher);
                this.registry.set(name, v);
                return v;
            }
        }
        else {
            return variable();
        }
    }
}
exports.Context = Context;
