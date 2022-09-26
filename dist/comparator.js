"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparator = exports.get = exports.CompareResult = void 0;
var CompareResult;
(function (CompareResult) {
    CompareResult[CompareResult["LessThan"] = -1] = "LessThan";
    CompareResult[CompareResult["BiggerThan"] = 1] = "BiggerThan";
    CompareResult[CompareResult["Equal"] = 0] = "Equal";
})(CompareResult = exports.CompareResult || (exports.CompareResult = {}));
function get(obj, ...path) {
    let [current, ...rest] = path;
    if (obj !== undefined || obj !== null) {
        if (current === undefined) {
            return obj;
        }
        else if (typeof current === 'function') {
            return get(current(obj), ...rest);
        }
        else if (typeof obj === 'object') {
            return get(obj[current], ...rest);
        }
        else if (typeof obj === 'string') {
            return get(obj[current], ...rest);
        }
    }
}
exports.get = get;
function comparator(...path) {
    return (a, b) => {
        let aa = get(a, ...path);
        let bb = get(b, ...path);
        if (aa < bb) {
            // console.log(aa, '<', bb)
            return CompareResult.LessThan;
        }
        else if (aa > bb) {
            // console.log(aa, '>', bb)
            return CompareResult.BiggerThan;
        }
        // console.log(aa, '==', bb)
        return CompareResult.Equal;
    };
}
exports.comparator = comparator;
