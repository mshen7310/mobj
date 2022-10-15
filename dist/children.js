"use strict";
// function curry(f: Function, arity = f.length, ...args) {
//     return arity <= args.length ? f(...args) : (...argz) => curry(f, arity, ...args, ...argz)
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.children = exports.iterators = exports.getter = exports.isPath = exports.setKey = exports.isSetKey = exports.mapKey = exports.isMapKey = exports.fromGeneratorFn = exports.isGenerator = void 0;
function isGenerator(fn) {
    return fn !== undefined
        && fn !== null
        && typeof fn === 'object'
        && typeof fn[Symbol.iterator] === 'function';
}
exports.isGenerator = isGenerator;
function fromGeneratorFn(x) {
    return isGenerator(x) && !Array.isArray(x) && !(x instanceof Map) && !(x instanceof Set);
}
exports.fromGeneratorFn = fromGeneratorFn;
class Context {
    constructor() {
        this.skip_node = new WeakSet();
        this.node = [];
    }
    skip(...a) {
        let array = a.length === 0 ? this.node : a;
        for (let n of array) {
            if (typeof n === 'object' && n !== null) {
                this.skip_node.add(n);
            }
        }
    }
    skipped(a) {
        return this.skip_node.has(a);
    }
    push(node) {
        return this.node.push(node);
    }
    pop() {
        return this.node.pop();
    }
}
function isMapKey(p) {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === 'MapKey';
}
exports.isMapKey = isMapKey;
function mapKey(k) {
    return [k, 'MapKey'];
}
exports.mapKey = mapKey;
function isSetKey(p) {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === 'SetKey';
}
exports.isSetKey = isSetKey;
function setKey(v) {
    return [v, 'SetKey'];
}
exports.setKey = setKey;
function isPath(p) {
    switch (typeof p) {
        case 'symbol':
        case 'string':
        case 'number': {
            return true;
        }
        case 'object': {
            return isSetKey(p) || isMapKey(p);
        }
        default: {
            // it's fine that the next line is not covered by test case 
            // because non-path object will be taken as the data to search
            // 
            return false;
        }
    }
}
exports.isPath = isPath;
function getter(set_getter, ...path) {
    function get(path, obj) {
        if (obj instanceof Map && isMapKey(path) && obj.has(path[0])) {
            return [obj.get(path[0])];
        }
        else if (obj instanceof Set && isSetKey(path)) {
            if (obj.has(path[0])) {
                return [path[0]];
            }
            else if (typeof path[0] === 'object' && path[0] !== null) {
                return set_getter ? set_getter(path[0], obj) : [];
            }
            else {
                return [];
            }
        }
        else if (obj !== null && obj !== undefined && !isSetKey(path) && !isMapKey(path) && Reflect.has(obj, path)) {
            return [obj[path]];
        }
        else {
            return [];
        }
    }
    return (obj) => {
        if (path.length === 0) {
            return [obj];
        }
        else {
            let [p, ...rest] = path;
            let tmp = get(p, obj);
            if (tmp.length === 0) {
                return [];
            }
            else {
                let rest_get = getter(set_getter, ...rest);
                return rest_get(tmp[0]);
            }
        }
    };
}
exports.getter = getter;
function iterators(...args) {
    let ret = new Map([
        [Map, function* map_iterator(map) {
                for (let [k, v] of map) {
                    yield [mapKey(k), v, true];
                }
            }],
        [Set, function* set_iterator(set) {
                for (let v of set) {
                    yield [setKey(v), v, true];
                }
            }],
        [Array, function* array_iterator(array) {
                let i = 0;
                for (let v of array) {
                    yield [i++, v, true];
                }
            }],
        [Object, function* object_iterator(obj) {
                for (let k of Reflect.ownKeys(obj)) {
                    yield [k, obj[k], true];
                }
            }]
    ]);
    let fallback = args.filter(x => !Array.isArray(x));
    let tmp = args.filter(Array.isArray);
    for (let [cons, gen] of tmp) {
        ret.set(cons, gen);
    }
    return function* (...objs) {
        if (objs.length > 0) {
            let obj = objs[0];
            if (typeof obj === 'object' && obj !== null && obj !== undefined) {
                let gen = ret.get(obj.constructor);
                if (gen !== undefined) {
                    yield* gen(...objs);
                    return;
                }
            }
            if (fallback.length > 0) {
                yield* fallback[0](...objs);
            }
            else if (obj !== null && obj !== undefined && !obj.constructor) {
                for (let k of Reflect.ownKeys(obj)) {
                    yield [k, obj[k], true];
                }
            }
        }
    };
}
exports.iterators = iterators;
const default_iterator = iterators();
function children(depth = Infinity, ite = default_iterator) {
    return function* (...objects) {
        let visited = new WeakSet();
        let ctx = new Context();
        function* walk(path, dpth, ...args) {
            const done = (...x) => {
                // console.log('done', ...x)
                ctx.skip(...x);
            };
            if (args.length > 0 && !visited.has(args[0])) {
                let obj = args[0];
                if (typeof obj === 'object' && obj !== null) {
                    visited.add(obj);
                }
                yield [done, path, obj];
                if (dpth > 0 && !ctx.skipped(obj)) {
                    for (let [key, child, should_search] of ite(obj)) {
                        if (should_search) {
                            ctx.push(child);
                            try {
                                yield* walk([...path, key], dpth - 1, child);
                            }
                            finally {
                                ctx.pop();
                            }
                        }
                        else {
                            yield [done, [...path, key], child];
                        }
                    }
                }
            }
        }
        yield* walk([], depth, ...objects);
    };
}
exports.children = children;
