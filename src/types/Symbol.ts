import { Generator, GeneratorSymbol, Matcher, MatcherSymbol, Type } from ".";
import { elementOf } from "../random";
import { isString, isStringArray } from "./String";
export type SymbolPattern = symbol | symbol[] | string | string[]


export function isSymbol(data: any): data is symbol {
    return typeof data === 'symbol'
}
export function isSymbolArray(data: any): data is symbol[] {
    return Array.isArray(data) && data.filter(x => !isSymbol(x)).length === 0
}
export function isSymbolPattern(data: any): data is SymbolPattern {
    return isSymbol(data)
        || isSymbolArray(data)
        || isString(data)
        || isStringArray(data)
}
class SymbolClass implements Type<symbol, SymbolPattern>{
    constructor(private ptn: SymbolPattern) {
        if (!isSymbolPattern(ptn)) {
            throw Error(`Expect symbol | symbol[] | string | string[], got ${ptn}: ${typeof ptn}`)
        }
    }
    getPatternArray(): symbol[] {
        if (isString(this.ptn)) {
            return [Symbol.for(this.ptn)]
        } else if (isStringArray(this.ptn)) {
            return this.ptn.map(x => Symbol.for(x))
        } else if (isSymbol(this.ptn)) {
            return [this.ptn]
        } else {
            return this.ptn
        }
    }
    pattern(): SymbolPattern {
        return this.ptn
    }
    factory(): (p: SymbolPattern) => Type<symbol, SymbolPattern> {
        return makeSymbol
    }
    generator(): Generator<symbol> {
        let ptn: symbol[] = this.getPatternArray()
        let ret: () => symbol = () => elementOf(ptn)
        ret[GeneratorSymbol] = true
        return ret;
    }
    matcher(): Matcher {
        let self = this;
        let ptn: symbol[] = this.getPatternArray()
        let ret: (data: any) => boolean = (data: any) => typeof data === 'symbol' && ptn.find(x => x === data) !== undefined
        ret[MatcherSymbol] = true
        return ret;
    }
}

export default function makeSymbol(pattern: SymbolPattern): Type<symbol, SymbolPattern> {
    return new SymbolClass(pattern)
}