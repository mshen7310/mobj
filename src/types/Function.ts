import { Sampler, SamplerSymbol, Matcher, MatcherSymbol, Type, DifferSymbol, Differ, Diff } from ".";

export type FunctionPattern = any

export function isFunction(data: any): data is Function {
    return typeof data === 'function' || data instanceof Function
}

class FunctionClass implements Type<(...arg: any[]) => any, FunctionPattern> {
    constructor(private ptn: FunctionPattern) {
        if (isFunction(ptn)) {
            throw Error(`Expect function, got ${ptn}: ${typeof ptn}`)
        }
    }
    pattern(): FunctionPattern {
        return this.ptn
    }
    factory(): (p: FunctionPattern) => Type<(...arg: any[]) => any, FunctionPattern> {
        return makeFunction
    }
    sampler(): Sampler<(...arg: any[]) => any> {
        let self = this;
        let ret = isFunction(this.ptn) ? () => self.ptn : () => () => undefined
        ret[SamplerSymbol] = true
        return ret;
    }
    differ(): Differ<FunctionPattern> {
        let self = this
        let ret: (data: any) => IterableIterator<Diff<FunctionPattern>>
        if (isFunction(this.ptn)) {
            function* retf(data: any) {
                if (!isFunction(data) || data !== self.ptn) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else {
            function* retf(data: any) {
                if (!isFunction(data)) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        }
        ret[DifferSymbol] = true
        return ret
    }
    matcher(): Matcher {
        let self = this;
        let ret: (data: any) => boolean
        if (isFunction(this.ptn)) {
            ret = (data: any) => isFunction(data) && data === self.ptn
        } else {
            ret = (data: any) => isFunction(data)
        }
        ret[MatcherSymbol] = true
        return ret;
    }
}

export default function makeFunction(pattern: FunctionPattern): Type<(...arg: any[]) => any, FunctionPattern> {
    return new FunctionClass(pattern)
}