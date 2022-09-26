import { GeneratorSymbol, Generator, Matcher, MatcherSymbol, Type } from "."
import { bigintOf, elementOf } from "../random"

export type BigintRange = [bigint, bigint]

export function isBigintRange(data: any): data is BigintRange {
    return isBigintArray(data)
        && data.length === 2
        && data[1] >= data[0]
}
export function isBigintArray(data: any): data is bigint[] {
    return Array.isArray(data)
        && data.filter(x => typeof x !== 'bigint').length === 0
}
export type BigintPattern = bigint | BigintRange | BigintRange[] | bigint[]

export function isBigintRangeArray(data: any): data is BigintRange[] {
    return Array.isArray(data) && data.filter(x => !isBigintRange(x)).length === 0
}
export function isBigintPattern(data: any): data is BigintPattern {
    return typeof data === 'bigint'
        || isBigintRange(data)
        || isBigintRangeArray(data)
        || isBigintArray(data)
}
class NumberClass implements Type<bigint, BigintPattern>{
    constructor(private ptn: BigintPattern) {
        if (!isBigintPattern(ptn)) {
            throw Error(`Expect bigint | [bigint, bigint] | [bigint, bigint][] | bigint[], got ${ptn}: ${typeof ptn}`)
        }
    }
    pattern(): BigintPattern {
        return this.ptn
    }
    factory(): (p: BigintPattern) => Type<bigint, BigintPattern> {
        return makeBigint;
    }
    generator(): Generator<bigint> {
        function rangeGenerator(start: bigint, end: bigint): Generator<bigint> {
            let max = start > end ? start : end
            let min = start < end ? start : end
            return () => bigintOf(min, max)
        }
        let self = this;
        let ret: () => bigint;
        if (typeof self.ptn === 'bigint') {
            ret = () => self.ptn as bigint
        } else if (isBigintRange(self.ptn)) {
            let [start, end] = self.ptn
            ret = rangeGenerator(start, end)
        } else if (isBigintRangeArray(self.ptn)) {
            let [start, end] = elementOf(self.ptn)
            ret = rangeGenerator(start, end)
        } else if (isBigintArray(self.ptn)) {
            ret = () => elementOf(self.ptn as bigint[])
        }
        ret[GeneratorSymbol] = true
        return ret;
    }
    matcher(): Matcher {
        let self = this;
        let ret: (data: any) => boolean;
        if (typeof self.ptn === 'bigint') {
            ret = (data: any) => typeof data === 'bigint' && data === self.ptn
        } else if (isBigintRange(self.ptn)) {
            let [start, end] = self.ptn
            ret = (data: any) => typeof data === 'bigint' && data >= start && data <= end
        } else if (isBigintRangeArray(self.ptn)) {
            ret = (data: any) => {
                if (typeof data === 'bigint') {
                    let ptn: BigintRange[] = self.ptn as BigintRange[]
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i]
                        if (data >= start && data <= end) {
                            return true
                        }
                    }
                }
                return false;
            }
        } else if (isBigintArray(self.ptn)) {
            ret = (data: any) => typeof data === 'bigint' && (self.ptn as bigint[]).find(x => x === data) === data
        }
        ret[MatcherSymbol] = true;
        return ret;
    }

}

export default function makeBigint(pattern: BigintPattern): Type<bigint, BigintPattern> {
    return new BigintClass(pattern)
}
