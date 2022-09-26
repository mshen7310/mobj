import { Generator, GeneratorSymbol, Matcher, MatcherSymbol, Type } from ".";

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
    generator(): Generator<(...arg: any[]) => any> {
        let self = this;
        let ret = isFunction(this.ptn) ? () => self.ptn : () => () => undefined
        ret[GeneratorSymbol] = true
        return ret;
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