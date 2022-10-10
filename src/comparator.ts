import { Path, path } from "./search";

export enum CompareResult {
    LessThan = -1,
    BiggerThan = 1,
    Equal = 0
}
export function comparator(...p: Path[]): (a: any, b: any) => CompareResult {
    return (a: any, b: any) => {
        let aa = path(Array.from, p)()(a)[0]
        let bb = path(Array.from, p)()(b)[0]
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
