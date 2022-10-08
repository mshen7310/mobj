"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.variable = void 0;
const equal_1 = require("./equal");
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
            return (0, equal_1.deepEqual)(value, arg[0]);
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
        this.registry = new Map();
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
