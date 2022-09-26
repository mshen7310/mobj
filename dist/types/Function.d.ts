import { Type } from ".";
export declare type FunctionPattern = any;
export declare function isFunction(data: any): data is Function;
export default function makeFunction(pattern: FunctionPattern): Type<(...arg: any[]) => any, FunctionPattern>;
