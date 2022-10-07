"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chain = exports.mapFilter = exports.map = exports.filter = exports.isGenerator = void 0;
function isGenerator(fn) {
    return fn !== undefined
        && fn !== null
        && typeof fn === 'object'
        && typeof fn[Symbol.iterator] === 'function';
}
exports.isGenerator = isGenerator;
function filter(p) {
    return function* (gen) {
        for (let x of gen) {
            if (p(x)) {
                yield x;
            }
        }
    };
}
exports.filter = filter;
function map(t) {
    return function* (gen) {
        for (let x of gen) {
            yield t(x);
        }
    };
}
exports.map = map;
function mapFilter(fn) {
    return function* (gen) {
        for (let x of gen) {
            let array = fn(x);
            if (Array.isArray(array) && array.length === 1) {
                yield array[0];
            }
        }
    };
}
exports.mapFilter = mapFilter;
function bind(fn1, fn2) {
    return function* (gen) {
        yield* fn2(fn1(gen));
    };
}
function chain(...fn) {
    let [f, ...rest] = fn;
    if (typeof f === 'function') {
        if (rest.length > 0) {
            return bind(f, chain(...rest));
        }
        else {
            return f;
        }
    }
    else if (rest.length > 0) {
        return chain(...rest);
    }
    else {
        return function* (gen) {
            yield* gen;
        };
    }
}
exports.chain = chain;
