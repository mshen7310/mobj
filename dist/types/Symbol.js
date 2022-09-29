"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSymbolPattern = exports.isSymbolArray = exports.isSymbol = void 0;
const _1 = require(".");
const random_1 = require("../random");
const String_1 = require("./String");
function isSymbol(data) {
    return typeof data === 'symbol';
}
exports.isSymbol = isSymbol;
function isSymbolArray(data) {
    return Array.isArray(data) && data.filter(x => !isSymbol(x)).length === 0;
}
exports.isSymbolArray = isSymbolArray;
function isSymbolPattern(data) {
    return isSymbol(data)
        || isSymbolArray(data)
        || (0, String_1.isString)(data)
        || (0, String_1.isStringArray)(data);
}
exports.isSymbolPattern = isSymbolPattern;
class SymbolClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (!isSymbolPattern(ptn)) {
            throw Error(`Expect symbol | symbol[] | string | string[], got ${ptn}: ${typeof ptn}`);
        }
    }
    getPatternArray() {
        if ((0, String_1.isString)(this.ptn)) {
            return [Symbol.for(this.ptn)];
        }
        else if ((0, String_1.isStringArray)(this.ptn)) {
            return this.ptn.map(x => Symbol.for(x));
        }
        else if (isSymbol(this.ptn)) {
            return [this.ptn];
        }
        else {
            return this.ptn;
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeSymbol;
    }
    sampler() {
        let ptn = this.getPatternArray();
        let ret = () => (0, random_1.elementOf)(ptn);
        ret[_1.SamplerSymbol] = true;
        return ret;
    }
    differ() {
        let self = this;
        let ptn = this.getPatternArray();
        let ret;
        function* retf(data) {
            if (typeof data !== 'symbol' || ptn.find(x => x === data) === undefined) {
                return {
                    key: [],
                    expect: self.ptn,
                    got: data
                };
            }
        }
        ret = retf;
        ret[_1.DifferSymbol] = true;
        return ret;
    }
    matcher() {
        let ptn = this.getPatternArray();
        let ret = (data) => typeof data === 'symbol' && ptn.find(x => x === data) !== undefined;
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeSymbol(pattern) {
    return new SymbolClass(pattern);
}
exports.default = makeSymbol;
