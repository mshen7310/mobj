import { PassivePath } from "./search";
export declare type Difference = {
    path: PassivePath[];
    type: 'missing' | 'redundant' | 'discrepancy';
    expected?: any;
    actual?: any;
    info?: any;
};
export declare function match(pattern: any): (data?: any) => Generator<any, void, any>;
