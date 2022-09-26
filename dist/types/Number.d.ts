import { Type } from ".";
export declare type NumberRange = [number, number];
export declare function isNumberRange(data: any): data is NumberRange;
export declare function isNumberArray(data: any): data is number[];
export declare type NumberPattern = number | NumberRange | NumberRange[] | number[];
export declare function isNumberRangeArray(data: any): data is NumberRange[];
export declare function isNumberPattern(data: any): data is NumberPattern;
export default function makeNumber(pattern: NumberPattern): Type<number, NumberPattern>;
