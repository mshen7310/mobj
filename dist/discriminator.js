"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optional = exports.discriminator = exports.diffSetElement = exports.isDifference = exports.DifferenceType = exports.variable = void 0;
const deepEqual_1 = require("./deepEqual");
const children_1 = require("./children");
function variable(matcher) {
    let value;
    let empty = true;
    matcher = matcher ? matcher : () => true;
    function ret(...arg) {
        if (arg.length === 0) {
            return;
        }
        else if (empty && matcher(arg[0])) {
            value = arg[0];
            empty = false;
            return true;
        }
        else if (!empty) {
            return (0, deepEqual_1.deepEqual)(value, arg[0]);
        }
        else {
            return false;
        }
    }
    Object.defineProperty(ret, 'value', {
        get: () => value
    });
    Object.defineProperty(ret, 'empty', {
        get: () => empty
    });
    return ret;
}
exports.variable = variable;
var DifferenceType;
(function (DifferenceType) {
    DifferenceType["Absence"] = "absence";
    DifferenceType["Redundancy"] = "redundancy";
    DifferenceType["Discrepancy"] = "discrepancy";
})(DifferenceType = exports.DifferenceType || (exports.DifferenceType = {}));
function isDifference(x) {
    return typeof x === 'object'
        && x !== null
        && Array.isArray(x.path)
        && typeof x.type === 'string';
}
exports.isDifference = isDifference;
function diffSetElement(e, set) {
    let ptn = discriminator(e);
    for (let from_set of set) {
        let different = false;
        for (let _ of ptn(from_set)) {
            different = true;
            break;
        }
        if (!different) {
            return [from_set];
        }
    }
    return [];
}
exports.diffSetElement = diffSetElement;
function discriminator(pattern) {
    const DiffFnSymbol = Symbol.for('DiffFnSymbol');
    if (typeof pattern === 'function' && pattern[DiffFnSymbol]) {
        return pattern;
    }
    function shallowEqual(x, y) {
        if (x instanceof RegExp && typeof y === 'string') {
            return x.test(y);
        }
        if (typeof x !== typeof y) {
            return false;
        }
        if (x === y || (Number.isNaN(x) && Number.isNaN(y))) {
            return true;
        }
        if (typeof x !== 'object' || x === null || y === null) {
            return false;
        }
        if (x instanceof Date && y instanceof Date) {
            return x.getTime() === y.getTime();
        }
        if (x instanceof RegExp && y instanceof RegExp) {
            return x.toString() === y.toString();
        }
        if (x.constructor !== y.constructor) {
            return false;
        }
    }
    let walk = (0, children_1.children)();
    function* difffn(...data) {
        for (let [done, path, value] of walk(pattern)) {
            const peerArray = (0, children_1.getter)(diffSetElement, ...path)(data[0]);
            if (typeof value === 'function') {
                let tmp = value(...peerArray);
                if ((0, children_1.fromGeneratorFn)(tmp)) {
                    for (let rec of tmp) {
                        if (isDifference(rec)) {
                            yield { ...rec, path: path.concat(rec.path) };
                        }
                        else {
                            yield rec;
                        }
                    }
                }
                else if (tmp === false) {
                    if (peerArray.length > 0) {
                        yield {
                            path,
                            type: DifferenceType.Discrepancy,
                            expected: value,
                            actual: peerArray[0],
                            info: value.toString()
                        };
                    }
                    else {
                        yield {
                            path,
                            type: DifferenceType.Absence,
                            expected: value,
                            info: value.toString()
                        };
                    }
                }
            }
            else {
                if (peerArray.length === 0) {
                    done(value);
                    yield {
                        path,
                        type: DifferenceType.Absence,
                        expected: value,
                    };
                }
                else {
                    if (false === shallowEqual(value, peerArray[0])) {
                        done(value);
                        yield {
                            path,
                            type: DifferenceType.Discrepancy,
                            expected: value,
                            actual: peerArray[0]
                        };
                    }
                }
            }
        }
    }
    difffn[DiffFnSymbol] = true;
    return difffn;
}
exports.discriminator = discriminator;
function optional(pattern) {
    let fn = discriminator(pattern);
    return function* (...data) {
        if (data.length > 0) {
            yield* fn(...data);
        }
    };
}
exports.optional = optional;
