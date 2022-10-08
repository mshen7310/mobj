import { Sampler, SamplerSymbol, Matcher, MatcherSymbol, Type, DifferSymbol, Differ, Diff } from ".";
import { intOf, random } from "../random";
export type BooleanPattern = boolean | undefined
class BooleanClass implements Type<boolean, BooleanPattern>{
    constructor(private ptn: BooleanPattern) {
        if (typeof ptn !== 'boolean' && ptn !== undefined) {
            throw Error(`Expect boolean | undefined, got ${ptn}: ${typeof ptn}`)
        }
    }
    pattern(): BooleanPattern {
        return this.ptn
    }
    factory(): (p: BooleanPattern) => Type<boolean, BooleanPattern> {
        return makeBoolean
    }
    sampler(rate: number = 0.5): Sampler<boolean> {
        let self = this;
        let ret: () => boolean
        if (self.ptn === undefined) {
            ret = () => random() <= rate
        } else {
            ret = () => self.ptn
        }
        ret[SamplerSymbol] = true
        return ret;
    }
    differ(): Differ<BooleanPattern> {
        let self = this
        let ret: (data: any) => IterableIterator<Diff<BooleanPattern>>
        if (self.ptn === undefined) {
            function* retf(data: any) {
                if (typeof data !== 'boolean') {
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
                if (typeof data !== 'boolean' || data !== self.ptn) {
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
        if (self.ptn === undefined) {
            ret = (data: any) => typeof (data) === 'boolean'
        } else {
            ret = (data: any) => typeof (data) === 'boolean' && data === self.ptn
        }
        ret[MatcherSymbol] = true
        return ret;
    }
}

export default function makeBoolean(pattern: BooleanPattern): Type<boolean, BooleanPattern> {
    return new BooleanClass(pattern)
}