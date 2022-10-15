import { getter, Path } from "./children";
import { equalSetElement } from "./deepEqual";

export enum CompareResult {
    LessThan = -1,
    BiggerThan = 1,
    Equal = 0
}
export function comparator(...p: Path[]): (a: any, b: any) => CompareResult {
    let get = getter(equalSetElement, ...p)
    return (a: any, b: any) => {
        let aa = get(a)[0]
        let bb = get(b)[0]
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
