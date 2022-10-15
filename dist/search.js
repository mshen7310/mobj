"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.search = void 0;
const children_1 = require("./children");
const deepEqual_1 = require("./deepEqual");
function* asGenerator(a) {
    if ((0, children_1.fromGeneratorFn)(a)) {
        yield* a;
    }
    else if (a !== undefined) {
        yield a;
    }
}
function search(fn, depth = Infinity) {
    let c = (0, children_1.children)(depth);
    return function* (...objs) {
        for (let [done, path, value] of c(objs[0])) {
            yield* asGenerator(fn(value, path, done));
        }
    };
}
exports.search = search;
function walker(set_getter, ...path) {
    function toWalkerFn(p) {
        if (typeof p === 'function') {
            return function* (...objs) {
                if (objs.length > 0) {
                    yield* asGenerator(p(objs[0]));
                }
            };
        }
        else {
            let get = (0, children_1.getter)(set_getter, p);
            return function* (...objs) {
                if (objs.length > 0) {
                    // get(objs[0]) return [any?]
                    // yield* to caller directly
                    yield* get(objs[0]);
                }
            };
        }
    }
    return function* (...args) {
        if (args.length > 0) {
            let [current, ...rest] = path;
            if (current === undefined) {
                yield args[0];
            }
            else {
                let fn = toWalkerFn(current);
                let restfn = walker(set_getter, ...rest);
                for (let ret of fn(args[0])) {
                    yield* restfn(ret);
                }
            }
        }
    };
}
function path(set_getter = deepEqual_1.equalSetElement) {
    let all_path = [];
    let retFn = new Proxy(() => { }, {
        apply(target, thisArg, argumentsList) {
            function isData(x) {
                // Map/Set key [any, string] cannot be specified by . or [] operator 
                // e.g. path()[setKey(2)] is illegal 
                // so Map/Set key has to be specified via function application
                // number/string/symbol can be specified via . or [], when they are treated
                // as normal data when pass in as function argument
                return !(0, children_1.isSetKey)(x) && typeof x !== 'function' && !(0, children_1.isMapKey)(x);
            }
            let not_path = argumentsList.filter(x => isData(x));
            let is_path = argumentsList.filter(x => !isData(x));
            all_path = all_path.concat(is_path);
            if (is_path.length > 0 && not_path.length === 0) {
                return retFn;
            }
            let w = walker(set_getter, ...all_path);
            if (is_path.length === 0 && not_path.length === 0) {
                return function (...obj) {
                    return Array.from(w(...obj));
                };
            }
            else {
                return Array.from(w(...not_path));
            }
        },
        get(_target, prop, receiver) {
            if (typeof prop === 'string') {
                let i = parseInt(prop);
                all_path.push(isNaN(i) ? prop : i);
            }
            else {
                all_path.push(prop);
            }
            return receiver;
        }
    });
    return retFn;
}
exports.path = path;
