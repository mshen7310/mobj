import { Path } from ".";
export declare enum CompareResult {
    LessThan = -1,
    BiggerThan = 1,
    Equal = 0
}
export declare function get(obj: any, ...path: Path[]): any;
export declare function comparator(...path: Path[]): (a: any, b: any) => CompareResult;
