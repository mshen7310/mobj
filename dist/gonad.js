"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.filter = void 0;
function filter(p) {
    return function* (gen, ...arg) {
        for (let x of gen(...arg)) {
            if (p(x)) {
                yield x;
            }
        }
    };
}
exports.filter = filter;
function map(t) {
    return function* (gen, ...arg) {
        for (let x of gen()) {
            yield t(x);
        }
    };
}
exports.map = map;
