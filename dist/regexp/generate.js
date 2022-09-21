"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const RandExp = require('randexp');
function generate(pattern) {
    let g = new RandExp(pattern);
    return () => g.gen();
}
exports.generate = generate;
