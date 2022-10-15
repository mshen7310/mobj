"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.or = exports.and = exports.not = exports.match = void 0;
const discriminator_1 = require("./discriminator");
function match(pattern) {
    let fn = (0, discriminator_1.discriminator)(pattern);
    return function (...data) {
        for (let _ of fn(...data)) {
            return false;
        }
        return true;
    };
}
exports.match = match;
function not(pattern) {
    let fn = match(pattern);
    return function (...data) {
        return !fn(...data);
    };
}
exports.not = not;
function and(...pattern) {
    let fns = pattern.map(match);
    return function (...data) {
        for (let fn of fns) {
            if (!fn(...data)) {
                return false;
            }
        }
        return true;
    };
}
exports.and = and;
function or(...pattern) {
    let fns = pattern.map(match);
    return function (...data) {
        for (let fn of fns) {
            if (fn(...data)) {
                return true;
            }
        }
        return false;
    };
}
exports.or = or;
