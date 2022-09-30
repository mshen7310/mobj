import { descendant, identical, path } from '../src/path'
import 'mocha'
import { strict as assert } from 'node:assert';

const data = {
    [Symbol.for('some_symbol')]: 12,
    hello: {
        world: 'hello world'
    },
    date: new Date(),
    regexp: /hello/,
    map: new Map(Object.entries({ a: 1, b: 2 })),
    set: new Set(['a', 'b']),
    work: {
        kkk: {
            hello: {
                world: {
                    a: [1, 2, 3],
                    b: ['a', 'b', 'c'],
                    d: [{
                        k: 'k1',
                        z: 'z1'
                    }, {
                        k: 'k2',
                        z: 'z2'
                    }]
                }
            }
        }
    }
}
describe('Path functions', () => {
    it('should return [ 12 ]', () => {
        const p = path().hello((_, k, __) => {
            return [undefined]
        }).world()
        assert.deepEqual(p(data), [])
    })

    it('should return [ 12 ]', () => {
        const p = path()[Symbol.for('some_symbol')]()
        assert.deepEqual(p(data), [{ value: 12, path: [Symbol.for('some_symbol')] }])
    })
    it('should return [ 2 ]', () => {
        const p = path().work.kkk.hello.world.a[2]()
        assert.deepEqual(p(data), [{ value: 3, path: ['work', 'kkk', 'hello', 'world', 'a', 2] }])
    })
    it('should return [ 1 ]', () => {
        const p = path().map.a()
        assert.deepEqual(p(data), [{ value: 1, path: ['map', 'a'] }])
    })

    it('should return undefined', () => {
        const p = path(1).hello.world();
        assert.deepEqual(p(data), [])
    });
    it('should return "hello world"', () => {
        const p = path().hello.world();
        assert.deepEqual(p(data), [{ value: data.hello.world, path: ['hello', 'world'] }])
    })
    it('should return 4', () => {
        const p = path().work.kkk('hello', (value: any, key: string) => {
            if (key === 'world') {
                return [{ a: 1, b: 2 }]
            }
        }).b((v: number) => [v * 2])()
        assert.deepEqual(p(data), [{ value: 4, path: ['work', 'kkk', 'hello', 'world', 'b'] }])
    })
    it('should throw Exception', () => {
        const p = path().work.kkk('hello', (value: any, key: string) => {
            if (key === 'world') {
                return [{ a: 1, b: 2 }]
            }
        }).b((v: number) => v * 2)()
        assert.throws(() => p(data), {
            name: 'TypeError',
            message: 'Invalid result of MapFilter, should return "undefined | [any]"',
            MapFilter: '(v) => v * 2',
            return: 4
        })
    })

});
describe('descendant **', () => {
    it('should return [{ k: "k1", z: "z1" }, { k: "k2", z: "z2" }]', () => {
        const p = path(descendant((value) => {
            if (typeof value === 'object' && 'k' in value && 'z' in value) {
                return [value]
            }
        }, Infinity))()
        assert.deepEqual(p(data), [{
            value: {
                k: 'k1', z: 'z1'
            },
            path: ['work', 'kkk', 'hello', 'world', 'd', 0]
        }, {
            value: {
                k: 'k2', z: 'z2'
            },
            path: ['work', 'kkk', 'hello', 'world', 'd', 1]
        }])
    })
    it('should return []', () => {
        const pp = path(descendant((value) => {
            if (typeof value === 'object' && 'k' in value && 'z' in value) {
                return [value]
            }
        }, 2))()
        assert.deepEqual(pp(data), [])
    })
    it('should NOT enter infinite loop', () => {
        const pp = path(descendant((value, _, parent) => {
            if (typeof value === 'object' && 'k' in value && 'z' in value) {
                return [parent]
            }
        }, Infinity))()
        assert.deepEqual(pp(data), [{
            value: data.work.kkk.hello.world.d,
            path: ['work', 'kkk', 'hello', 'world', 'd', 0]
        }, {
            value: data.work.kkk.hello.world.d,
            path: ['work', 'kkk', 'hello', 'world', 'd', 1]
        }])
    })

});

describe('work on undefined, null, number, boolean, string, Date and RegExp', () => {
    it('should return [undefined]', () => {
        const pp = path((value: any) => {
            // console.log({ value })
            if (value === undefined) {
                return [value] as [any]
            }
        })()
        assert.deepEqual(pp([undefined]), [{ value: undefined, path: [0] }])
    })

    it('should return []', () => {
        const pp = path((value: any) => { })()
        assert.deepEqual(pp(data), [])
    })
    it('should return []', () => {
        const pp = path()()
        assert.deepEqual(pp(data), [{ value: data, path: [] }])
    })

    it('should return [Date]', () => {
        const p = path()((d: any) => {
            if (d instanceof Date) {
                return [d]
            }
        })()
        assert.deepEqual(p(data), [{ value: data.date, path: ['date'] }])
    })
    it('should return [RegExp]', () => {
        const p = path()((d: any) => {
            if (d instanceof RegExp) {
                return [d]
            }
        })()
        assert.deepEqual(p(data), [{ value: data.regexp, path: ['regexp'] }])
    })

    it('should return []', () => {
        const pp = path(descendant((value) => {
            if (value && typeof value === 'object' && 'k' in value && 'z' in value) {
                return [value]
            }
        }))()
        assert.deepEqual(pp(null), [])
    })
    it('should return []', () => {
        const pp = path(descendant((value) => {
            if (value && typeof value === 'object' && 'k' in value && 'z' in value) {
                return [value]
            }
        }, 2))()
        assert.deepEqual(pp({}), [])
    })
    it('should return []', () => {
        const pp = path(descendant((value) => {
            if (value && typeof value === 'object' && 'k' in value && 'z' in value) {
                return [value]
            }
        }, 2))()
        assert.deepEqual(pp([]), [])
    })
    it('should return []', () => {
        const pp = path(descendant(undefined, Infinity))()
        assert.deepEqual(pp(), [])
    })
    it('should return [2]', () => {
        const pp = path(descendant(undefined, Infinity))()
        assert.deepEqual(pp(2), [{ value: 2, path: [] }])
    })
    it('should return [true]', () => {
        const pp = path(descendant(undefined, Infinity))()
        assert.deepEqual(pp(true), [{ value: true, path: [] }])
    })
    it('should return ["hello"]', () => {
        const pp = path(descendant(undefined, Infinity))()
        assert.deepEqual(pp('hello'), [{ value: 'hello', path: [] }])
    })

    it('should return []', () => {
        const pp = path(identical)()
        assert.deepEqual(pp(), [])
    })
    it('should return [null]', () => {
        const pp = path((x: any) => {
            if (x === null) {
                return [x] as [any]
            }
        })()
        assert.deepEqual(pp(null), [{ value: null, path: [] }])
    })
})
describe('work on Set and Map', () => {
    it('should find all element in the set', () => {
        const p = path(descendant((x, _, p) => {
            if (p instanceof Set) {
                return [x]
            }
        }, Infinity))()
        assert.deepEqual(p(data), [
            { value: 'a', path: ['set', undefined] },
            { value: 'b', path: ['set', undefined] },
        ])
    })
    it('should find all element in the map', () => {
        const p = path(descendant((x, _, p) => {
            if (p instanceof Map) {
                return [x]
            }
        }, Infinity))()
        assert.deepEqual(p(data), [
            { value: 1, path: ['map', 'a'] },
            { value: 2, path: ['map', 'b'] },
        ])
    })
})