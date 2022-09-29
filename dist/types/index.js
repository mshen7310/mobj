"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSampler = exports.isMatcher = exports.isDiffer = exports.DifferSymbol = exports.MatcherSymbol = exports.SamplerSymbol = void 0;
exports.SamplerSymbol = Symbol.for('alpacar.Sampler');
exports.MatcherSymbol = Symbol.for('alpacar.Matcher');
exports.DifferSymbol = Symbol.for('alpacar.Differ');
function isDiffer(f) {
    return typeof f === 'function' && f[exports.DifferSymbol] === true;
}
exports.isDiffer = isDiffer;
function isMatcher(f) {
    return typeof f === 'function' && f[exports.MatcherSymbol] === true;
}
exports.isMatcher = isMatcher;
function isSampler(f) {
    return typeof f === 'function' && f[exports.SamplerSymbol] === true;
}
exports.isSampler = isSampler;
