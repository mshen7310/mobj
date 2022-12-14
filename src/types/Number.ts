import { SamplerSymbol, Sampler, Matcher, MatcherSymbol, Type, Differ, Diff, DifferSymbol } from "."
import { elementOf, intOf, numberOf } from "../random"

export type NumberRange = [number, number]

export function isNumberRange(data: any): data is NumberRange {
    return isNumberArray(data)
        && data.length === 2
        && data[1] >= data[0]
}
export function isNumberArray(data: any): data is number[] {
    return Array.isArray(data)
        && data.filter(x => typeof x !== 'number').length === 0
}
export type NumberPattern = number | NumberRange | NumberRange[] | number[]

export function isNumberRangeArray(data: any): data is NumberRange[] {
    return Array.isArray(data) && data.filter(x => !isNumberRange(x)).length === 0
}
export function isNumberPattern(data: any): data is NumberPattern {
    return typeof data === 'number'
        || isNumberRange(data)
        || isNumberRangeArray(data)
        || isNumberArray(data)
}
class NumberClass implements Type<number, NumberPattern>{
    constructor(private ptn: NumberPattern) {
        if (!isNumberPattern(ptn)) {
            throw Error(`Expect number | [number, number] | [number, number][] | number[], got ${ptn}: ${typeof ptn}`)
        }
    }
    pattern(): NumberPattern {
        return this.ptn
    }
    factory(): (p: NumberPattern) => Type<number, NumberPattern> {
        return makeNumber;
    }
    sampler(): Sampler<number> {
        function rangeGenerator(start: number, end: number): Sampler<number> {
            let max = Math.max(start, end)
            let min = Math.min(start, end)
            if (max === Math.floor(max) && min === Math.ceil(min)) {
                return () => intOf(min, max)
            } else {
                return () => numberOf(min, max)
            }
        }
        let self = this;
        let ret: () => number;
        if (typeof self.ptn === 'number') {
            ret = () => self.ptn as number
        } else if (isNumberRange(self.ptn)) {
            let [start, end] = self.ptn
            ret = rangeGenerator(start, end)
        } else if (isNumberRangeArray(self.ptn)) {
            let [start, end] = elementOf(self.ptn)
            ret = rangeGenerator(start, end)
        } else if (isNumberArray(self.ptn)) {
            ret = () => elementOf(self.ptn as number[])
        }
        ret[SamplerSymbol] = true
        return ret;
    }
    differ(): Differ<NumberPattern> {
        let self = this;
        let ret: (data: any) => IterableIterator<Diff<NumberPattern>>
        if (typeof self.ptn === 'number') {
            function* retf(data: any) {
                if (typeof data !== 'number' || data !== self.ptn) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else if (isNumberRange(self.ptn)) {
            function* retf(data: any) {
                let [start, end] = self.ptn as NumberRange
                if (typeof data !== 'number' || data > end || data < start) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else if (isNumberArray(self.ptn)) {
            function* retf(data: any) {
                if (typeof data !== 'number' || (self.ptn as number[]).find(x => x === data) === undefined) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else if (isNumberRangeArray(self.ptn)) {
            function* retf(data: any) {
                if (typeof data === 'number') {
                    let ptn: NumberRange[] = self.ptn as NumberRange[]
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i]
                        if (data >= start && data <= end) {
                            return
                        }
                    }
                }
                return {
                    key: [],
                    expect: self.ptn,
                    got: data
                }
            }
            ret = retf
        }
        ret[DifferSymbol] = true;
        return ret;
    }
    //matcher might be redundent
    matcher(): Matcher {
        let self = this;
        let ret: (data: any) => boolean;
        if (typeof self.ptn === 'number') {
            ret = (data: any) => typeof data === 'number' && data === self.ptn
        } else if (isNumberRange(self.ptn)) {
            let [start, end] = self.ptn
            ret = (data: any) => typeof data === 'number' && data >= start && data <= end
        } else if (isNumberRangeArray(self.ptn)) {
            ret = (data: any) => {
                if (typeof data === 'number') {
                    let ptn: NumberRange[] = self.ptn as NumberRange[]
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i]
                        if (data >= start && data <= end) {
                            return true
                        }
                    }
                }
                return false;
            }
        } else if (isNumberArray(self.ptn)) {
            ret = (data: any) => typeof data === 'number' && (self.ptn as number[]).find(x => x === data) === data
        }
        ret[MatcherSymbol] = true;
        return ret;
    }

}

export default function makeNumber(pattern: NumberPattern): Type<number, NumberPattern> {
    return new NumberClass(pattern)
}
