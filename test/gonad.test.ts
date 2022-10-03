import { filter, map, isGenerator, chain, mapFilter } from '../src/gonad'
import 'mocha'
import { strict as assert } from 'node:assert';


describe('isGenerator', () => {
    it('should return true for []', () => {
        assert.deepEqual(isGenerator([]), true)
    })
    it('should return true for function*(){}', () => {
        assert.deepEqual(isGenerator((function* () { })()), true)
    })
    it('should return true for function*(){yield 1}', () => {
        assert.deepEqual(isGenerator((function* () { yield 1 })()), true)
    })
    it('should return true for function*(){return 2}', () => {
        assert.deepEqual(isGenerator((function* () { return 2 })()), true)
    })
    it('should return true for function*(){yield 1;return 2}', () => {
        assert.deepEqual(isGenerator((function* () { yield 1; return 2 })()), true)
    })
    it('should return false for function(){}', () => {
        assert.deepEqual(isGenerator((function () { })()), false)
    })
    it('should return false for async function(){}', () => {
        assert.deepEqual(isGenerator((async function () { })()), false)
    })
})


describe('filter', () => {
    it('should filter []', () => {
        let src = [1, 2, 3]
        let f = filter((x: number) => x > 1)
        let tmp = Array.from(f(src))
        assert.deepEqual(tmp, [
            2,
            3,
        ])
    })
    it('should filter {}', () => {
        let src = { a: 1, b: 2, c: 3 }
        let f = filter(([k, _]) => k === 'a')
        let tmp = Array.from(f(Object.entries(src)))
        assert.deepEqual(tmp, [
            ['a', 1]
        ])
    })
})
describe('filter', () => {
    it('should filter []', () => {
        let src = [1, 2, 3]
        let f = map((x: number) => `${x * 2}hello`)
        let tmp = Array.from(f(src))
        assert.deepEqual(tmp, [
            '2hello',
            '4hello',
            '6hello'
        ])
    })
    it('should filter {}', () => {
        let src = { a: 1, b: 2, c: 3 }
        let f = map(([k, v]) => ({ k, v }))
        let tmp = Array.from(f(Object.entries(src)))
        assert.deepEqual(tmp, [
            { k: 'a', v: 1 },
            { k: 'b', v: 2 },
            { k: 'c', v: 3 },
        ])
    })
})

describe('mapFilter', () => {
    it('should mapFilter []', () => {
        let src = [1, 2, 3]
        let f = mapFilter((x: number) => {
            if (x === 1) {
                return [`${x * 2}hello`]
            }
        })
        let tmp = Array.from(f(src))
        assert.deepEqual(tmp, [
            '2hello',
        ])
    })
    it('should mapFilter {}', () => {
        let src = { a: 1, b: 2, c: 3 }
        let f = mapFilter(([k, v]) => {
            if (k === 'a') {
                return [{ k, v }]
            }
        })
        let tmp = Array.from(f(Object.entries(src)))
        assert.deepEqual(tmp, [
            { k: 'a', v: 1 },
        ])
    })
})

describe('chain', () => {
    it('should chain map1, map2, filter1, filter2', () => {
        let src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        let f = chain(
            map(x => x + 1)
            , filter(x => (x % 2) === 0)
            , map(x => `${x}hello`)
            , map(x => x.toUpperCase()))
        let tmp = Array.from(f(src))
        assert.deepEqual(tmp, [
            '2HELLO',
            '4HELLO',
            '6HELLO',
            '8HELLO',
            '10HELLO',
        ])
    })
    it('should chain filter, map, mapFilter over {}', () => {
        let src = { a: 1, b: 2, c: 3, d: 4 }
        let f = chain(
            'should omit any non-function elements' as any
            , filter(([k, v]) => (v % 2) === 0)
            , map(([k, v]) => ({ k, v }))
            , mapFilter(({ k, v }) => {
                if (k === 'b') {
                    return [v * 2]
                }
            })
            , 'should omit any non-function elements' as any
        )
        let tmp = Array.from(f(Object.entries(src)))
        assert.deepEqual(tmp, [
            4,
        ])
    })
})

