import { Path } from "./property";

export enum FieldType {
    Struct = 'Struct',
    Array = 'Array',
    Replace = 'Replace'
}

export type Diff = {
    key?: Path[],
    type: FieldType,
    delta: {
        pattern?: any,
        data?: any,
    } | Diff[]
    comment?: any,
}

// function isPattern(p: any): boolean {
//     return typeof p === 'function' && Array.isArray(p[patternType] === PatternType.Matcher)
// }
function pattern_match(pattern, data): boolean {
    if (pattern === data) {
        return true;
    }
    // if (isPattern(pattern)) {
    //     return pattern(data)
    // }
    return false;
}
// export function diff(pattern?: any, data?: any, key?: Path): Diff | undefined {
//     if (!pattern_match(pattern, data)) {
//         if (typeof pattern === typeof data) {
//             if (typeof pattern === 'object') {
//                 if (pattern !== null && data !== null) {
//                     if ((Array.isArray(pattern) && Array.isArray(data)) || (!Array.isArray(pattern) && !Array.isArray(data))) {
//                         let is_array = Array.isArray(pattern);
//                         let all_keys: Exclude<Path, ((x: any) => any)>[] = [...new Set(Object.keys(pattern).concat(Object.keys(data)))]
//                         if (is_array) {
//                             all_keys = all_keys.map((x: string) => {
//                                 let t = parseInt(x)
//                                 return isNaN(t) ? x : t;
//                             })
//                         }
//                         let delta = all_keys.map(k => diff(pattern[k], data[k], k)).filter(x => x !== undefined);
//                         if (delta.length > 0) {
//                             return {
//                                 key: [key],
//                                 type: is_array ? FieldType.Array : FieldType.Struct,
//                                 delta
//                             }
//                         } else {
//                             return;
//                         }
//                     }
//                 }
//             }
//         }
//         return {
//             key: [key],
//             type: FieldType.Replace,
//             delta: {
//                 pattern: isPattern(pattern) ? pattern['pattern'] : pattern,
//                 data

//             }
//         }
//     }
// }




