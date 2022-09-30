"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.at = void 0;
function at(level = 0) {
    let e = new Error();
    let s = e.stack.split("\n")[2 + level];
    let match = s.match(/\((.*):(\d+):(\d+)\)$/);
    return {
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3])
    };
}
exports.at = at;
