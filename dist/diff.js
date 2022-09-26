"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diff = exports.FieldType = void 0;
const _1 = require(".");
var FieldType;
(function (FieldType) {
    FieldType["Struct"] = "Struct";
    FieldType["Array"] = "Array";
    FieldType["Replace"] = "Replace";
})(FieldType = exports.FieldType || (exports.FieldType = {}));
function isPattern(p) {
    return typeof p === 'function' && Array.isArray(p[_1.patternType] === _1.PatternType.Matcher);
}
function pattern_match(pattern, data) {
    if (pattern === data) {
        return true;
    }
    if (isPattern(pattern)) {
        return pattern(data);
    }
    return false;
}
function diff(pattern, data, key) {
    if (!pattern_match(pattern, data)) {
        if (typeof pattern === typeof data) {
            if (typeof pattern === 'object') {
                if (pattern !== null && data !== null) {
                    if ((Array.isArray(pattern) && Array.isArray(data)) || (!Array.isArray(pattern) && !Array.isArray(data))) {
                        let is_array = Array.isArray(pattern);
                        let all_keys = [...new Set(Object.keys(pattern).concat(Object.keys(data)))];
                        if (is_array) {
                            all_keys = all_keys.map((x) => {
                                let t = parseInt(x);
                                return isNaN(t) ? x : t;
                            });
                        }
                        let delta = all_keys.map(k => diff(pattern[k], data[k], k)).filter(x => x !== undefined);
                        if (delta.length > 0) {
                            return {
                                key: [key],
                                type: is_array ? FieldType.Array : FieldType.Struct,
                                delta
                            };
                        }
                        else {
                            return;
                        }
                    }
                }
            }
        }
        return {
            key: [key],
            type: FieldType.Replace,
            delta: {
                pattern: isPattern(pattern) ? pattern['pattern'] : pattern,
                data
            }
        };
    }
}
exports.diff = diff;
