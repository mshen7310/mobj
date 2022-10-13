import { PassivePath } from "./search";
export declare type Predicate<T = any> = (...data: T[]) => boolean;
export interface Variable<T = any> {
    (...value: T[]): boolean;
    readonly value: T;
    readonly empty: boolean;
}
export declare function variable<T = any>(matcher?: Predicate<T>): Variable<T>;
export declare type Difference = {
    path: PassivePath[];
    type: 'missing' | 'redundant' | 'discrepancy';
    expected?: any;
    actual?: any;
    info?: any;
};
export declare function isDifference(x: any): x is Difference;
export declare type DiffFn<T = any> = (...data: T[]) => IterableIterator<Difference>;
export declare function diff(pattern: any): DiffFn;
export declare function optional(pattern: any): DiffFn<Difference>;
