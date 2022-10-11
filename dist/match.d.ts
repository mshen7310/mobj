import { PassivePath } from "./search";
export declare type Matcher = (...data: any[]) => boolean;
export declare type Variable = <T>(...value: T[]) => boolean;
export declare function variable(matcher?: Matcher): Variable;
export declare type Difference = {
    path: PassivePath[];
    type: 'missing' | 'redundant' | 'discrepancy';
    expected?: any;
    actual?: any;
    info?: any;
};
export declare function isDifference(x: any): x is Difference;
export declare function match(pattern: any): any;
export declare function optional(pattern: any): (...data: any[]) => Generator<any, void, any>;
export declare function allOf(...pattern: any[]): (...data: any[]) => Generator<any, void, any>;
export declare function noneOf(...pattern: any[]): (...data: any[]) => Generator<{
    path: any[];
    type: string;
    expected: any;
}, void, unknown>;
export declare function oneOf(...pattern: any[]): (...data: any[]) => Generator<{
    path: any[];
    type: string;
    expected: any;
}, void, unknown>;
