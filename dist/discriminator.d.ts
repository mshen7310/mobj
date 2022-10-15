import { Path } from "./children";
export declare type Predicate<T = any> = (...data: T[]) => boolean;
export interface Variable<T = any> {
    (...value: T[]): boolean;
    readonly value: T;
    readonly empty: boolean;
}
export declare function variable<T = any>(matcher?: Predicate<T>): Variable<T>;
export declare enum DifferenceType {
    Absence = "absence",
    Redundancy = "redundancy",
    Discrepancy = "discrepancy"
}
declare type Missing = {
    path: Path[];
    type: DifferenceType.Absence;
    expected: any;
    info?: any;
};
declare type Discrepancy = {
    path: Path[];
    type: DifferenceType.Discrepancy;
    expected: any;
    actual: any;
    info?: any;
};
export declare type Difference = Missing | Discrepancy;
export declare function isDifference(x: any): x is Difference;
export declare type DiffFn<T = any> = (...data: T[]) => Generator<Difference>;
export declare function diffSetElement(e: any, set: Set<any>): readonly [any?];
export declare function discriminator(pattern: any): DiffFn;
export declare function optional(pattern: any): DiffFn<Difference>;
export {};
