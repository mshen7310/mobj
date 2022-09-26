import { Sampler, SamplerSymbol, Matcher, MatcherSymbol, Type, Differ, Diff, DifferSymbol } from ".";
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
    sampler(): Sampler<undefined> {
        let ret = () => undefined
        ret[SamplerSymbol] = true
        return ret;
    }
    differ(): Differ<UndefinedPattern> {
        let ret: (data: any) => IterableIterator<Diff<UndefinedPattern>>
        function* retf(data: any) {
            if (data !== undefined) {
                return {
                    key: [],
                    expect: undefined,
                    got: data
                }
            }
        }
        ret = retf
        ret[DifferSymbol] = true
        return ret
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