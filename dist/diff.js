"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = void 0;
const search_1 = require("./search");
function* match(a, b) {
    (0, search_1.path)(a => a)((0, search_1.search)((obj, ctx) => {
    }))()(a);
}
exports.match = match;
