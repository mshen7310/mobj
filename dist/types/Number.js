"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumberPattern = exports.isNumberRangeArray = exports.isNumberArray = exports.isNumberRange = void 0;
const _1 = require(".");
const random_1 = require("../random");
function isNumberRange(data) {
    return isNumberArray(data)
        && data.length === 2
        && data[1] >= data[0];
}
exports.isNumberRange = isNumberRange;
function isNumberArray(data) {
    return Array.isArray(data)
        && data.filter(x => typeof x !== 'number').length === 0;
}
exports.isNumberArray = isNumberArray;
function isNumberRangeArray(data) {
    return Array.isArray(data) && data.filter(x => !isNumberRange(x)).length === 0;
}
exports.isNumberRangeArray = isNumberRangeArray;
function isNumberPattern(data) {
    return typeof data === 'number'
        || isNumberRange(data)
        || isNumberRangeArray(data)
        || isNumberArray(data);
}
exports.isNumberPattern = isNumberPattern;
class NumberClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (!isNumberPattern(ptn)) {
            throw Error(`Expect number | [number, number] | [number, number][] | number[], got ${ptn}: ${typeof ptn}`);
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeNumber;
    }
    generator() {
        function rangeGenerator(start, end) {
            let max = Math.max(start, end);
            let min = Math.min(start, end);
            if (max === Math.floor(max) && min === Math.ceil(min)) {
                return () => (0, random_1.intOf)(min, max);
            }
            else {
                return () => (0, random_1.numberOf)(min, max);
            }
        }
        let self = this;
        let ret;
        if (typeof self.ptn === 'number') {
            ret = () => self.ptn;
        }
        else if (isNumberRange(self.ptn)) {
            let [start, end] = self.ptn;
            ret = rangeGenerator(start, end);
        }
        else if (isNumberRangeArray(self.ptn)) {
            let [start, end] = (0, random_1.elementOf)(self.ptn);
            ret = rangeGenerator(start, end);
        }
        else if (isNumberArray(self.ptn)) {
            ret = () => (0, random_1.elementOf)(self.ptn);
        }
        ret[_1.GeneratorSymbol] = true;
        return ret;
    }
    matcher() {
        let self = this;
        let ret;
        if (typeof self.ptn === 'number') {
            ret = (data) => typeof data === 'number' && data === self.ptn;
        }
        else if (isNumberRange(self.ptn)) {
            let [start, end] = self.ptn;
            ret = (data) => typeof data === 'number' && data >= start && data <= end;
        }
        else if (isNumberRangeArray(self.ptn)) {
            ret = (data) => {
                if (typeof data === 'number') {
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
        else if (isNumberArray(self.ptn)) {
            ret = (data) => typeof data === 'number' && self.ptn.find(x => x === data) === data;
        }
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeNumber(pattern) {
    return new NumberClass(pattern);
}
exports.default = makeNumber;
