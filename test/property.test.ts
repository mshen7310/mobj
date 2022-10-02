import { from, walk, Property } from '../src/property'
import 'mocha'
import { strict as assert } from 'node:assert';
describe('from', () => {
    it('should iterate []', () => {
        let src = [1, 2, 3]
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, path: [0], root: src },
            { value: 2, path: [1], root: src },
            { value: 3, path: [2], root: src },
        ])
    })
    it('should iterate {}', () => {
        let src = { a: 1, b: 2, c: 3 }
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, path: ['a'], root: src },
            { value: 2, path: ['b'], root: src },
            { value: 3, path: ['c'], root: src },
        ])
    })
    it('should iterate Map', () => {
        let src = new Map(Object.entries({ a: 1, b: 2, c: 3 }))
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, path: ['a'], root: src },
            { value: 2, path: ['b'], root: src },
            { value: 3, path: ['c'], root: src },
        ])
    })
    it('should iterate Set', () => {
        let src = new Set([1, 2, 3])
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, path: [], root: src },
            { value: 2, path: [], root: src },
            { value: 3, path: [], root: src },
        ])
    })
    it('should iterate null', () => {
        let tmp = Array.from(from(null))
        assert.deepEqual(tmp, [
            { value: null, path: [] }
        ])
    })
    it('should iterate undefined', () => {
        let tmp = Array.from(from(undefined))
        assert.deepEqual(tmp, [
            { value: undefined, path: [] }
        ])
    })
    it('should iterate number', () => {
        let tmp = Array.from(from(1))
        assert.deepEqual(tmp, [
            { value: 1, path: [] }
        ])
    })
    it('should iterate boolean', () => {
        let tmp = Array.from(from(true))
        assert.deepEqual(tmp, [
            { value: true, path: [] }
        ])
    })
    it('should iterate bigint', () => {
        let tmp = Array.from(from(BigInt(1)))
        assert.deepEqual(tmp, [
            { value: BigInt(1), path: [] }
        ])
    })
    it('should iterate Date', () => {
        let src = new Date()
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: src, path: [] }
        ])
    })
    it('should iterate RegExp', () => {
        let src = /hello/i
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: src, path: [] }
        ])
    })
})
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

describe('walk', () => {
    it('should walk object, 1 level', () => {
        const data = {
            [Symbol.for('some_symbol')]: 12,
            world: 'kkk',
            hello: {
                world: 'hello world'
            },
            date: new Date(),
            regexp: /hello/,
            map: new Map(Object.entries({ a: 1, b: 2 })),
            set: new Set(['a', 'b']),
        }
        let tmp = Array.from(walk()(data))
        assert.deepEqual(tmp, [
            { value: data.world, path: ['world'], root: data },
            { value: data.hello, path: ['hello'], root: data },
            { value: data.date, path: ['date'], root: data },
            { value: data.regexp, path: ['regexp'], root: data },
            { value: data.map, path: ['map'], root: data },
            { value: data.set, path: ['set'], root: data },
            { value: 12, path: [Symbol.for('some_symbol')], root: data },
        ])
    })
    it('should walk object, Infinity level', () => {
        const data = {
            world: 'kkk',
            hello: {
                world: 'hello world'
            },
        }
        let tmp = Array.from(walk(Infinity)(data))
        assert.deepEqual(tmp, [
            { value: data.world, path: ['world'], root: data },
            { value: data.hello.world, path: ['hello', 'world'], root: data },
        ])
    })

})

