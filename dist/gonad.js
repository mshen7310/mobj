"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.children = exports.iterators = exports.isPath = exports.setKey = exports.isSetKey = exports.mapKey = exports.isMapKey = exports.Context = void 0;
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
exports.Context = Context;
const SetKeySymbol = Symbol.for('SetKeySymbol');
const MapKeySymbol = Symbol.for('MapKeySymbol');
function isMapKey(p) {
    return Array.isArray(p)
        && p.length === 2
        && p[1] === MapKeySymbol;
}
exports.isMapKey = isMapKey;
function mapKey(k) {
    return [k, MapKeySymbol];
}
exports.mapKey = mapKey;
function isSetKey(p) {
    return Array.isArray(p)
        && p.length === 2
        && typeof p[0] === 'number'
        && p[1] === SetKeySymbol;
}
exports.isSetKey = isSetKey;
function setKey(index) {
    return [index, SetKeySymbol];
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
            return false;
        }
    }
}
exports.isPath = isPath;
function iterators(...args) {
    let ret = new Map([
        [Map, function* map_iterator(map) {
                for (let [k, v] of map) {
                    yield [[k, MapKeySymbol], v, true];
                }
            }],
        [Set, function* set_iterator(set) {
                let i = 0;
                for (let v of set) {
                    yield [[i++, SetKeySymbol], v, true];
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
        }
    };
}
exports.iterators = iterators;
function children(depth = Infinity, ite = iterators()) {
    function* elements(...objects) {
        let visited = new WeakSet();
        let ctx = new Context();
        function* walk(path, dpth, ...args) {
            const done = (...x) => ctx.skip(...x);
            if (args.length === 0) {
                yield [done, path];
            }
            else if (!visited.has(args[0])) {
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
                        if (ctx.skipped(obj)) {
                            break;
                        }
                    }
                }
            }
        }
        yield* walk([], depth, ...objects);
    }
    return elements;
}
exports.children = children;
