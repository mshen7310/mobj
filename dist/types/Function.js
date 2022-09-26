"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = void 0;
const _1 = require(".");
function isFunction(data) {
    return typeof data === 'function' || data instanceof Function;
}
exports.isFunction = isFunction;
class FunctionClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (isFunction(ptn)) {
            throw Error(`Expect function, got ${ptn}: ${typeof ptn}`);
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeFunction;
    }
    generator() {
        let self = this;
        let ret = isFunction(this.ptn) ? () => self.ptn : () => () => undefined;
        ret[_1.GeneratorSymbol] = true;
        return ret;
    }
    matcher() {
        let self = this;
        let ret;
        if (isFunction(this.ptn)) {
            ret = (data) => isFunction(data) && data === self.ptn;
        }
        else {
            ret = (data) => isFunction(data);
        }
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeFunction(pattern) {
    return new FunctionClass(pattern);
}
exports.default = makeFunction;
