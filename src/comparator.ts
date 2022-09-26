import { Path, get } from "./path";

export enum CompareResult {
    LessThan = -1,
    BiggerThan = 1,
    Equal = 0
}
export function comparator(...path: Path): (a: any, b: any) => CompareResult {
    return (a: any, b: any) => {
        let aa = get(a, ...path)
        let bb = get(b, ...path)
        if (aa < bb) {
            // console.log(aa, '<', bb)
            return CompareResult.LessThan;
        } else if (aa > bb) {
            // console.log(aa, '>', bb)
            return CompareResult.BiggerThan;
        } else if (aa === bb) {
            // console.log(aa, '==', bb)
            return CompareResult.Equal;
        } else {
            throw Error(`Cannot compare ${aa}: ${typeof aa} against ${bb}: ${typeof bb}`)
        }
    }
}
