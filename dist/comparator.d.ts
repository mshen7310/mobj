import { Path } from "./property";
export declare enum CompareResult {
    LessThan = -1,
    BiggerThan = 1,
    Equal = 0
}
export declare function comparator(...p: Path[]): (a: any, b: any) => CompareResult;
