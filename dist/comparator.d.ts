import { Path } from "./path";
export declare enum CompareResult {
    LessThan = -1,
    BiggerThan = 1,
    Equal = 0
}
export declare function comparator(...path: Path): (a: any, b: any) => CompareResult;