import { Path } from ".";

export enum CompareResult {
    LessThan = -1,
    BiggerThan = 1,
    Equal = 0
}
export function get(obj: any, ...path: Path[]): any {
    let [current, ...rest] = path;
    if (obj !== undefined || obj !== null) {
        if (current === undefined) {
            return obj;
        } else if (typeof current === 'function') {
            return get(current(obj), ...rest);
        } else if (typeof obj === 'object') {
            return get(obj[current], ...rest)
        } else if (typeof obj === 'string') {
            return get(obj[current], ...rest)
        }
    }
}
export function comparator(...path: Path[]): (a: any, b: any) => CompareResult {
    return (a: any, b: any) => {
        let aa = get(a, ...path)
        let bb = get(b, ...path)
        if (aa < bb) {
            // console.log(aa, '<', bb)
            return CompareResult.LessThan;
        } else if (aa > bb) {
            // console.log(aa, '>', bb)
            return CompareResult.BiggerThan;
        }
        // console.log(aa, '==', bb)
        return CompareResult.Equal;
    }
}
