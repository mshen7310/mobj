"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patternType = exports.patternConstructor = exports.patternArguments = exports.PatternType = void 0;
var PatternType;
(function (PatternType) {
    PatternType["Generator"] = "Generator";
    PatternType["Matcher"] = "Matcher";
})(PatternType = exports.PatternType || (exports.PatternType = {}));
exports.patternArguments = Symbol.for('patternArguments');
exports.patternConstructor = Symbol.for('patternConstructor');
exports.patternType = Symbol.for('patternType');
