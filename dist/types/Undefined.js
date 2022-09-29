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
    sampler() {
        let ret = () => undefined;
        ret[_1.SamplerSymbol] = true;
        return ret;
    }
    differ() {
        let ret;
        function* retf(data) {
            if (data !== undefined) {
                return {
                    key: [],
                    expect: undefined,
                    got: data
                };
            }
        }
        ret = retf;
        ret[_1.DifferSymbol] = true;
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
