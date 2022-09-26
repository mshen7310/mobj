import { Type } from ".";
export declare type BigintRange = [bigint, bigint];
export declare function isBigintRange(data: any): data is BigintRange;
export declare function isBigintArray(data: any): data is bigint[];
export declare type BigintPattern = bigint | BigintRange | BigintRange[] | bigint[];
export declare function isBigintRangeArray(data: any): data is BigintRange[];
export declare function isBigintPattern(data: any): data is BigintPattern;
export default function makeBigint(pattern: BigintPattern): Type<bigint, BigintPattern>;
