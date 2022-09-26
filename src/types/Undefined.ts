import { Generator, GeneratorSymbol, Matcher, MatcherSymbol, Type } from ".";
export type UndefinedPattern = undefined
class UndefinedClass implements Type<undefined, UndefinedPattern>{
    constructor(private ptn: UndefinedPattern) {
        if (ptn !== undefined) {
            throw Error(`Expect undefined, got ${ptn}: ${typeof ptn}`)
        }
    }
    pattern(): UndefinedPattern {
        return this.ptn
    }
    factory(): (p: UndefinedPattern) => Type<undefined, UndefinedPattern> {
        return makeUndefined
    }
    generator(): Generator<undefined> {
        let ret = () => undefined
        ret[GeneratorSymbol] = true
        return ret;
    }
    matcher(): Matcher {
        let ret = (data: any) => data === undefined
        ret[MatcherSymbol] = true
        return ret;
    }
}

export default function makeUndefined(pattern: UndefinedPattern): Type<undefined, UndefinedPattern> {
    return new UndefinedClass(pattern)
}