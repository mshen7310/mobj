"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = void 0;
function match(pattern) {
    return (data) => pattern.test(data);
}
exports.match = match;
