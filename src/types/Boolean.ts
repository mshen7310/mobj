import { fi } from "date-fns/locale";
import { Generator, GeneratorSymbol, Matcher, MatcherSymbol, Type } from ".";
import { intOf } from "../random";
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
    generator(): Generator<boolean> {
        let self = this;
        let ret: () => boolean
        if (self.ptn === undefined) {
            ret = () => [true, false][intOf(1)]
        } else {
            ret = () => self.ptn
        }
        ret[GeneratorSymbol] = true
        return ret;
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