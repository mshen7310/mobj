"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparator = exports.CompareResult = void 0;
const path_1 = require("./path");
var CompareResult;
(function (CompareResult) {
    CompareResult[CompareResult["LessThan"] = -1] = "LessThan";
    CompareResult[CompareResult["BiggerThan"] = 1] = "BiggerThan";
    CompareResult[CompareResult["Equal"] = 0] = "Equal";
})(CompareResult = exports.CompareResult || (exports.CompareResult = {}));
function comparator(...p) {
    return (a, b) => {
        let aa = (0, path_1.path)(...p)()(a)[0];
        let bb = (0, path_1.path)(...p)()(b)[0];
        if (aa < bb) {
            // console.log(aa, '<', bb)
            return CompareResult.LessThan;
        }
        else if (aa > bb) {
            // console.log(aa, '>', bb)
            return CompareResult.BiggerThan;
        }
        else if (aa === bb) {
            // console.log(aa, '==', bb)
            return CompareResult.Equal;
        }
        else {
            throw Error(`Cannot compare ${aa}: ${typeof aa} against ${bb}: ${typeof bb}`);
        }
    };
}
exports.comparator = comparator;
