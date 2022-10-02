import { filter, map, lift, from, isGenerator, Property } from '../src/gonad'
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

describe('from', () => {
    it('should iterate []', () => {
        let src = [1, 2, 3]
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, key: 0, parent: src },
            { value: 2, key: 1, parent: src },
            { value: 3, key: 2, parent: src },
        ])
    })
    it('should iterate {}', () => {
        let src = { a: 1, b: 2, c: 3 }
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, key: 'a', parent: src },
            { value: 2, key: 'b', parent: src },
            { value: 3, key: 'c', parent: src },
        ])
    })
    it('should iterate Map', () => {
        let src = new Map(Object.entries({ a: 1, b: 2, c: 3 }))
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, key: 'a', parent: src },
            { value: 2, key: 'b', parent: src },
            { value: 3, key: 'c', parent: src },
        ])
    })
    it('should iterate Set', () => {
        let src = new Set([1, 2, 3])
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: 1, parent: src },
            { value: 2, parent: src },
            { value: 3, parent: src },
        ])
    })
    it('should iterate null', () => {
        let tmp = Array.from(from(null))
        assert.deepEqual(tmp, [
            { value: null }
        ])
    })
    it('should iterate undefined', () => {
        let tmp = Array.from(from(undefined))
        assert.deepEqual(tmp, [
            { value: undefined }
        ])
    })
    it('should iterate number', () => {
        let tmp = Array.from(from(1))
        assert.deepEqual(tmp, [
            { value: 1 }
        ])
    })
    it('should iterate boolean', () => {
        let tmp = Array.from(from(true))
        assert.deepEqual(tmp, [
            { value: true }
        ])
    })
    it('should iterate bigint', () => {
        let tmp = Array.from(from(BigInt(1)))
        assert.deepEqual(tmp, [
            { value: BigInt(1) }
        ])
    })
    it('should iterate Date', () => {
        let src = new Date()
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: src }
        ])
    })
    it('should iterate RegExp', () => {
        let src = /hello/i
        let tmp = Array.from(from(src))
        assert.deepEqual(tmp, [
            { value: src }
        ])
    })
})
describe('filter', () => {
    it('should filter []', () => {
        let src = [1, 2, 3]
        let f = filter((x: Property) => x.value > 1)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            { value: 2, key: 1, parent: src },
            { value: 3, key: 2, parent: src },
        ])
    })
    it('should filter {}', () => {
        let src = { a: 1, b: 2, c: 3 }
        let f = filter((x: Property) => x.key === 'a')
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            { value: 1, key: 'a', parent: src },
        ])
    })
    it('should filter Map', () => {
        let src = new Map(Object.entries({ a: 1, b: 2, c: 3 }))
        let f = filter((x: Property) => x.key === 'a')
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            { value: 1, key: 'a', parent: src },
        ])
    })
    it('should filter Set', () => {
        let src = new Set([1, 2, 3])
        let f = filter((x: Property) => x.value === 1)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            { value: 1, parent: src },
        ])
    })
    it('should filter null', () => {
        let src = null
        let f = filter((x: Property) => x.value !== null)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [])
    })
    it('should filter undefined', () => {
        let src = undefined
        let f = filter((x: Property) => x.value !== undefined)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [])
    })
    it('should filter number', () => {
        let src = 1
        let f = filter((x: Property) => x.value !== 1)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [])
    })
    it('should filter boolean', () => {
        let src = true
        let f = filter((x: Property) => x.value !== true)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [])
    })
    it('should filter bigint', () => {
        let src = BigInt(1)
        let f = filter((x: Property) => x.value !== BigInt(1))
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [])
    })
    it('should filter Date', () => {
        let src = new Date()
        let f = filter((x: Property) => x.value.getTime() !== src.getTime())
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [])

    })
    it('should filter RegExp', () => {
        let src = /hello/i
        let f = filter((x: Property) => x.value.source !== src.source)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [])
    })
})
describe('map', () => {
    it('should transform []', () => {
        let src = [1, 2, 3]
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            1,
            2,
            3
        ])
    })
    it('should transform {}', () => {
        let src = { a: 1, b: 2, c: 3 }
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            1, 2, 3
        ])
    })
    it('should transform Map', () => {
        let src = new Map(Object.entries({ a: 1, b: 2, c: 3 }))
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            1, 2, 3
        ])
    })
    it('should transform Set', () => {
        let src = new Set([1, 2, 3])
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [
            1, 2, 3
        ])
    })
    it('should transform null', () => {
        let src = null
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [src])
    })
    it('should transform undefined', () => {
        let src = undefined
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [src])
    })
    it('should transform number', () => {
        let src = 1
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [src])
    })
    it('should transform boolean', () => {
        let src = true
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [src])
    })
    it('should transform bigint', () => {
        let src = BigInt(1)
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [src])
    })
    it('should transform Date', () => {
        let src = new Date()
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [src])

    })
    it('should transform RegExp', () => {
        let src = /hello/i
        let f = map((x: Property) => x.value)
        let tmp = Array.from(f(from(src)))
        assert.deepEqual(tmp, [src])
    })
})
