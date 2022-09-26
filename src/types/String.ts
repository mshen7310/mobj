import { Type, Sampler, Matcher, MatcherSymbol, SamplerSymbol, Diff, Differ, DifferSymbol } from ".";
import { elementOf, intOf } from "../random"
const RandExp = require("randexp/types")

// "undefined", "number", "string", "boolean", "bigint", "symbol", "object", or "function"
export type StringPattern = string | number | RegExp | string[]
export function isString(data: any): data is string {
    return typeof data === 'string'
}
export function isNumber(data: any): data is number {
    return typeof data === 'number'
}
export function isRegExp(data: any): data is RegExp {
    return data instanceof RegExp
}
export function isStringArray(data: any): data is string[] {
    return Array.isArray(data) && data.filter(x => typeof x !== 'string').length === 0
}
export function isStringPattern(data: any): data is StringPattern {
    return isString(data)
        || isNumber(data)
        || isRegExp(data)
        || isStringArray(data)
}
class StringClass implements Type<string, StringPattern>{
    constructor(private ptn: StringPattern) {
        if (!isStringPattern(ptn)) {
            throw Error(`Expect string | number | RegExp | string[], got ${ptn}: ${typeof ptn}`)
        } else if (isStringArray(ptn) && ptn.length <= 0) {
            throw Error(`Expect non-empty string[], got ${ptn}`)
        }
    }
    pattern(): StringPattern {
        return this.ptn
    }
    factory(): (p: StringPattern) => Type<string, StringPattern> {
        return makeString;
    }
    sampler(): Sampler<string> {
        let self = this;
        let ret: () => string;
        if (isString(self.ptn)) {
            ret = () => self.ptn as string
        } else if (isRegExp(self.ptn)) {
            let pt = new RandExp(self.ptn)
            ret = () => pt.gen()
        } else if (isNumber(self.ptn)) {
            ret = () => Array.from({ length: self.ptn as number }, () => String.fromCharCode(Math.floor(Math.random() * (65536)))).join('')
        } else if (isStringArray(self.ptn)) {
            ret = () => elementOf(self.ptn as string[])
        }
        ret[SamplerSymbol] = true
        return ret;
    }
    differ(): Differ<StringPattern> {
        let self = this
        let ret: (data: any) => IterableIterator<Diff<StringPattern>>
        if (isString(self.ptn)) {
            function* retf(data: any) {
                if (typeof data !== 'string' || data !== self.ptn) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else if (isNumber(self.ptn)) {
            function* retf(data: any) {
                if (typeof data !== 'string' || data.length !== self.ptn) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data,
                        message: `"${data}.length != ${self.ptn}"`
                    }
                }
            }
            ret = retf
        } else if (isRegExp(self.ptn)) {
            function* retf(data: any) {
                let ptn = self.ptn as RegExp;
                if (typeof data === 'string' && ptn.test(data)) {
                    return
                } else if (data instanceof RegExp && data.source === ptn.source) {
                    return
                }
                return {
                    key: [],
                    expect: ptn.source,
                    got: data,
                }
            }
            ret = retf
        } else if (isStringArray(self.ptn)) {
            function* retf(data: any) {
                if (typeof data !== 'string' || (self.ptn as string[]).find(x => data === x) === undefined) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        }
        ret[DifferSymbol] = true;
        return ret;
    }
    matcher(): Matcher {
        let self = this;
        let ret: (data: any) => boolean;
        if (isString(self.ptn)) {
            ret = (data: any) => (typeof data === 'string') && (data === self.ptn)
        } else if (isNumber(self.ptn)) {
            ret = (data: any) => (typeof data === 'string') && (data.length === self.ptn)
        } else if (isRegExp(self.ptn)) {
            ret = (data: any) => {
                let ptn = self.ptn as RegExp;
                if (typeof data === 'string') {
                    return ptn.test(data)
                } else if (data instanceof RegExp) {
                    return data.source === ptn.source
                }
                return false;
            }
        } else if (isStringArray(self.ptn)) {
            ret = (data: any) => {
                if (typeof data === 'string') {
                    let ptn: string[] = self.ptn as string[]
                    return ptn.find(x => data === x) === data
                }
                return false;
            }
        }
        ret[MatcherSymbol] = true;
        return ret;
    }

}

export default function makeString(pattern: StringPattern): Type<string, StringPattern> {
    return new StringClass(pattern)
}