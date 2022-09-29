"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringPattern = exports.isStringArray = exports.isRegExp = exports.isNumber = exports.isString = void 0;
const _1 = require(".");
const random_1 = require("../random");
const RandExp = require("randexp/types");
function isString(data) {
    return typeof data === 'string';
}
exports.isString = isString;
function isNumber(data) {
    return typeof data === 'number';
}
exports.isNumber = isNumber;
function isRegExp(data) {
    return data instanceof RegExp;
}
exports.isRegExp = isRegExp;
function isStringArray(data) {
    return Array.isArray(data) && data.filter(x => typeof x !== 'string').length === 0;
}
exports.isStringArray = isStringArray;
function isStringPattern(data) {
    return isString(data)
        || isNumber(data)
        || isRegExp(data)
        || isStringArray(data);
}
exports.isStringPattern = isStringPattern;
class StringClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (!isStringPattern(ptn)) {
            throw Error(`Expect string | number | RegExp | string[], got ${ptn}: ${typeof ptn}`);
        }
        else if (isStringArray(ptn) && ptn.length <= 0) {
            throw Error(`Expect non-empty string[], got ${ptn}`);
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeString;
    }
    sampler() {
        let self = this;
        let ret;
        if (isString(self.ptn)) {
            ret = () => self.ptn;
        }
        else if (isRegExp(self.ptn)) {
            let pt = new RandExp(self.ptn);
            ret = () => pt.gen();
        }
        else if (isNumber(self.ptn)) {
            ret = () => Array.from({ length: self.ptn }, () => String.fromCharCode(Math.floor(Math.random() * (65536)))).join('');
        }
        else if (isStringArray(self.ptn)) {
            ret = () => (0, random_1.elementOf)(self.ptn);
        }
        ret[_1.SamplerSymbol] = true;
        return ret;
    }
    differ() {
        let self = this;
        let ret;
        if (isString(self.ptn)) {
            function* retf(data) {
                if (typeof data !== 'string' || data !== self.ptn) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    };
                }
            }
            ret = retf;
        }
        else if (isNumber(self.ptn)) {
            function* retf(data) {
                if (typeof data !== 'string' || data.length !== self.ptn) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data,
                        message: `"${data}.length != ${self.ptn}"`
                    };
                }
            }
            ret = retf;
        }
        else if (isRegExp(self.ptn)) {
            function* retf(data) {
                let ptn = self.ptn;
                if (typeof data === 'string' && ptn.test(data)) {
                    return;
                }
                else if (data instanceof RegExp && data.source === ptn.source) {
                    return;
                }
                return {
                    key: [],
                    expect: ptn.source,
                    got: data,
                };
            }
            ret = retf;
        }
        else if (isStringArray(self.ptn)) {
            function* retf(data) {
                if (typeof data !== 'string' || self.ptn.find(x => data === x) === undefined) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    };
                }
            }
            ret = retf;
        }
        ret[_1.DifferSymbol] = true;
        return ret;
    }
    matcher() {
        let self = this;
        let ret;
        if (isString(self.ptn)) {
            ret = (data) => (typeof data === 'string') && (data === self.ptn);
        }
        else if (isNumber(self.ptn)) {
            ret = (data) => (typeof data === 'string') && (data.length === self.ptn);
        }
        else if (isRegExp(self.ptn)) {
            ret = (data) => {
                let ptn = self.ptn;
                if (typeof data === 'string') {
                    return ptn.test(data);
                }
                else if (data instanceof RegExp) {
                    return data.source === ptn.source;
                }
                return false;
            };
        }
        else if (isStringArray(self.ptn)) {
            ret = (data) => {
                if (typeof data === 'string') {
                    let ptn = self.ptn;
                    return ptn.find(x => data === x) === data;
                }
                return false;
            };
        }
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeString(pattern) {
    return new StringClass(pattern);
}
exports.default = makeString;
