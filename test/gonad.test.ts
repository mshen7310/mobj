import { filter, map, lift, isGenerator } from '../src/gonad'
import 'mocha'
import { strict as assert } from 'node:assert';

describe('lift', () => {
    it('should lift []', () => {
        let g = lift([1, 2, 3])
        let tmp = Array.from(g())
        assert.deepEqual(tmp, [1, 2, 3])
    })
    it('should lift generator function', () => {
        let src = function* () {
            yield 1
            yield 2
            yield 3
        }
        let g = lift(src)
        let tmp = Array.from(g())
        assert.deepEqual(tmp, [1, 2, 3])
    })
    it('should lift generator', () => {
        let src = function* () {
            yield 1
            yield 2
            yield 3
        }
        let g = lift(src())
        let tmp = Array.from(g())
        assert.deepEqual(tmp, [1, 2, 3])
    })
    it('should lift value', () => {
        let src = function () {
            return 1
        }
        let g = lift(src())
        let tmp = Array.from(g())
        assert.deepEqual(tmp, [1])
    })
    it('should lift function', () => {
        let src = function () {
            return 1
        }
        let g = lift(src)
        let tmp = Array.from(g())
        assert.deepEqual(tmp, [1])
    })

})

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
