import { Type } from ".";
export declare type SymbolPattern = symbol | symbol[] | string | string[];
export declare function isSymbol(data: any): data is symbol;
export declare function isSymbolArray(data: any): data is symbol[];
export declare function isSymbolPattern(data: any): data is SymbolPattern;
export default function makeSymbol(pattern: SymbolPattern): Type<symbol, SymbolPattern>;
