"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class UndefinedClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (ptn !== undefined) {
            throw Error(`Expect undefined, got ${ptn}: ${typeof ptn}`);
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeUndefined;
    }
    generator() {
        let ret = () => undefined;
        ret[_1.GeneratorSymbol] = true;
        return ret;
    }
    matcher() {
        let ret = (data) => data === undefined;
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeUndefined(pattern) {
    return new UndefinedClass(pattern);
}
exports.default = makeUndefined;
