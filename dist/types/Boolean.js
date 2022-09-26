"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const random_1 = require("../random");
class BooleanClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (typeof ptn !== 'boolean' && ptn !== undefined) {
            throw Error(`Expect boolean | undefined, got ${ptn}: ${typeof ptn}`);
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeBoolean;
    }
    generator() {
        let self = this;
        let ret;
        if (self.ptn === undefined) {
            ret = () => [true, false][(0, random_1.intOf)(1)];
        }
        else {
            ret = () => self.ptn;
        }
        ret[_1.GeneratorSymbol] = true;
        return ret;
    }
    matcher() {
        let self = this;
        let ret;
        if (self.ptn === undefined) {
            ret = (data) => typeof (data) === 'boolean';
        }
        else {
            ret = (data) => typeof (data) === 'boolean' && data === self.ptn;
        }
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeBoolean(pattern) {
    return new BooleanClass(pattern);
}
exports.default = makeBoolean;
