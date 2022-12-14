"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRandomSeed = exports.random = exports.numberOf = exports.elementOf = exports.intOf = exports.bigintOf = exports.anyOf = void 0;
function seed(s = 'random', alg = 3) {
    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
    }
    function sfc32(a, b, c, d) {
        return function () {
            a >>>= 0;
            b >>>= 0;
            c >>>= 0;
            d >>>= 0;
            var t = (a + b) | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            d = d + 1 | 0;
            t = t + d | 0;
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        };
    }
    function mulberry32(a) {
        return function () {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    function jsf32(a, b, c, d) {
        return function () {
            a |= 0;
            b |= 0;
            c |= 0;
            d |= 0;
            var t = a - (b << 27 | b >>> 5) | 0;
            a = b ^ (c << 17 | c >>> 15);
            b = c + d | 0;
            c = d + t | 0;
            d = a + t | 0;
            return (d >>> 0) / 4294967296;
        };
    }
    function xoshiro128ss(a, b, c, d) {
        return function () {
            var t = b << 9, r = a * 5;
            r = (r << 7 | r >>> 25) * 9;
            c ^= a;
            d ^= b;
            b ^= c;
            a ^= d;
            c ^= t;
            d = d << 11 | d >>> 21;
            return (r >>> 0) / 4294967296;
        };
    }
    if (typeof s === 'string') {
        let hex = cyrb128(s);
        switch (alg) {
            case 0: {
                return sfc32(hex[0], hex[1], hex[2], hex[3]);
            }
            case 1: {
                return mulberry32(hex[0]);
            }
            case 2: {
                return jsf32(hex[0], hex[1], hex[2], hex[3]);
            }
            case 3: {
                return xoshiro128ss(hex[0], hex[1], hex[2], hex[3]);
            }
            default: {
                throw Error(`Expect 0 | 1 | 2 | 3, got ${alg}: ${typeof alg}`);
            }
        }
    }
    else if (typeof s === 'number') {
        let cnt = s;
        return function () {
            cnt = Math.sin(cnt) * 10000;
            return cnt - Math.floor(cnt);
        };
    }
    else {
        return function () {
            return Math.random();
        };
    }
}
function anyOf(...arg) {
    return arg[intOf(0, arg.length - 1)];
}
exports.anyOf = anyOf;
function bigintOf(start, end) {
    if (end === undefined) {
        end = start > BigInt(0) ? start : BigInt(0);
        start = start > BigInt(0) ? BigInt(0) : start;
    }
    if (start > end) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    end += BigInt(1);
    const difference = end - start;
    const differenceLength = difference.toString().length;
    let multiplier = '';
    while (multiplier.length < differenceLength) {
        multiplier += (0, exports.random)()
            .toString()
            .split('.')[1];
    }
    multiplier = multiplier.slice(0, differenceLength);
    const divisor = '1' + '0'.repeat(differenceLength);
    const randomDifference = (difference * BigInt(multiplier)) / BigInt(divisor);
    return start + randomDifference;
}
exports.bigintOf = bigintOf;
function intOf(start, end) {
    if (end === undefined) {
        end = Math.max(start, 0);
        start = Math.min(start, 0);
    }
    if (start > end) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    return start + Math.round((0, exports.random)() * (end - start));
}
exports.intOf = intOf;
function elementOf(array) {
    if (Array.isArray(array)) {
        return array[intOf(array.length - 1)];
    }
    else if (array && typeof array === 'object') {
        return array[elementOf(Object.keys(array))];
    }
}
exports.elementOf = elementOf;
function numberOf(start, end) {
    if (end === undefined) {
        end = Math.max(start, 0);
        start = Math.min(start, 0);
    }
    if (start > end) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    return start + (0, exports.random)() * (end - start);
}
exports.numberOf = numberOf;
exports.random = seed();
function initRandomSeed(x = 'random', alg = 3) {
    return exports.random = seed(x, alg);
}
exports.initRandomSeed = initRandomSeed;
