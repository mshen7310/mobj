"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBigintPattern = exports.isBigintRangeArray = exports.isBigintArray = exports.isBigintRange = void 0;
const _1 = require(".");
const random_1 = require("../random");
function isBigintRange(data) {
    return isBigintArray(data)
        && data.length === 2
        && data[1] >= data[0];
}
exports.isBigintRange = isBigintRange;
function isBigintArray(data) {
    return Array.isArray(data)
        && data.filter(x => typeof x !== 'bigint').length === 0;
}
exports.isBigintArray = isBigintArray;
function isBigintRangeArray(data) {
    return Array.isArray(data) && data.filter(x => !isBigintRange(x)).length === 0;
}
exports.isBigintRangeArray = isBigintRangeArray;
function isBigintPattern(data) {
    return typeof data === 'bigint'
        || isBigintRange(data)
        || isBigintRangeArray(data)
        || isBigintArray(data);
}
exports.isBigintPattern = isBigintPattern;
class BigintClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (!isBigintPattern(ptn)) {
            throw Error(`Expect bigint | [bigint, bigint] | [bigint, bigint][] | bigint[], got ${ptn}: ${typeof ptn}`);
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeBigint;
    }
    generator() {
        function rangeGenerator(start, end) {
            let max = start > end ? start : end;
            let min = start < end ? start : end;
            return () => (0, random_1.bigintOf)(min, max);
        }
        let self = this;
        let ret;
        if (typeof self.ptn === 'bigint') {
            ret = () => self.ptn;
        }
        else if (isBigintRange(self.ptn)) {
            let [start, end] = self.ptn;
            ret = rangeGenerator(start, end);
        }
        else if (isBigintRangeArray(self.ptn)) {
            let [start, end] = (0, random_1.elementOf)(self.ptn);
            ret = rangeGenerator(start, end);
        }
        else if (isBigintArray(self.ptn)) {
            ret = () => (0, random_1.elementOf)(self.ptn);
        }
        ret[_1.GeneratorSymbol] = true;
        return ret;
    }
    matcher() {
        let self = this;
        let ret;
        if (typeof self.ptn === 'bigint') {
            ret = (data) => typeof data === 'bigint' && data === self.ptn;
        }
        else if (isBigintRange(self.ptn)) {
            let [start, end] = self.ptn;
            ret = (data) => typeof data === 'bigint' && data >= start && data <= end;
        }
        else if (isBigintRangeArray(self.ptn)) {
            ret = (data) => {
                if (typeof data === 'bigint') {
                    let ptn = self.ptn;
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i];
                        if (data >= start && data <= end) {
                            return true;
                        }
                    }
                }
                return false;
            };
        }
        else if (isBigintArray(self.ptn)) {
            ret = (data) => typeof data === 'bigint' && self.ptn.find(x => x === data) === data;
        }
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeBigint(pattern) {
    return new BigintClass(pattern);
}
exports.default = makeBigint;
