"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGenerator = exports.isMatcher = exports.PathBuilder = exports.MatcherSymbol = exports.GeneratorSymbol = void 0;
exports.GeneratorSymbol = Symbol.for('alpacar.Generator');
exports.MatcherSymbol = Symbol.for('alpacar.Matcher');
function PathBuilder() {
    let all_path = [];
    let ret = new Proxy(() => undefined, {
        apply(target, thisArg, argumentsList) {
            let ret = all_path;
            all_path = [];
            return ret;
        },
        get(target, prop, receiver) {
            if (typeof prop === 'symbol') {
                all_path.push(prop);
            }
            else {
                let i = parseInt(prop);
                all_path.push(isNaN(i) ? prop : i);
            }
            return receiver;
        }
    });
    return ret;
}
exports.PathBuilder = PathBuilder;
function isMatcher(f) {
    return typeof f === 'function' && f[exports.MatcherSymbol] === true;
}
exports.isMatcher = isMatcher;
function isGenerator(f) {
    return typeof f === 'function' && f[exports.GeneratorSymbol] === true;
}
exports.isGenerator = isGenerator;
