import { Type } from ".";
export declare type StringPattern = string | number | RegExp | string[];
export declare function isString(data: any): data is string;
export declare function isNumber(data: any): data is number;
export declare function isRegExp(data: any): data is RegExp;
export declare function isStringArray(data: any): data is string[];
export declare function isStringPattern(data: any): data is StringPattern;
export default function makeString(pattern: StringPattern): Type<string, StringPattern>;
