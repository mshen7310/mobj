import 'mocha'
import { strict as assert } from 'node:assert';
import { random, anyOf, bigintOf, elementOf, initRandomSeed, intOf, numberOf } from '../src/random'

describe('initRandomSeed', () => {
    it('should throw error', () => {
        assert.throws(() => initRandomSeed('random', 4 as any), {
            message: `Expect 0 | 1 | 2 | 3, got 4: number`
        })
    })
    it('should use sin generator', () => {
        initRandomSeed(1)
        assert.equal(typeof random(), 'number')
    })
    it('should use Math.random generator', () => {
        initRandomSeed(null as any)
        assert.equal(typeof random(), 'number')
    })
    it('should use default generator', () => {
        initRandomSeed()
        assert.equal(typeof random(), 'number')
    })

})

describe('anyOf', () => {
    it(`should return one of it's arguments`, () => {
        initRandomSeed('random', 0)
        let array = [Number(1), String('a'), { b: 'b' }, ['c']].sort()
        let tmp = new Set()
        for (let i = 0; i < 20; ++i) {
            tmp.add(anyOf(...array))
        }
        let result = [...tmp].sort()
        assert.deepEqual(array, result)
    })
})

describe('numberOf', () => {
    it(`should return a number > 100`, () => {
        initRandomSeed('random', 1)
        let tmp: any[] = []
        let start = 100
        let end = 200
        for (let i = 0; i < 200; ++i) {
            tmp.push(numberOf(start, end))
        }
        assert.deepEqual(tmp.filter(x => x <= start).length, 0)
    })
    it(`should return a number < 200`, () => {
        initRandomSeed('random', 2)
        let tmp: any[] = []
        let start = 100
        let end = 200
        for (let i = 0; i < 200; ++i) {
            tmp.push(numberOf(start, end))
        }
        assert.deepEqual(tmp.filter(x => x >= end).length, 0)
    })
    it(`should ensure start < end`, () => {
        initRandomSeed('random', 3)
        let tmp: any[] = []
        let start = 200
        let end = 100
        for (let i = 0; i < 200; ++i) {
            tmp.push(numberOf(start, end))
        }
        assert.deepEqual(tmp.filter(x => x >= start).length, 0)
    })
    it(`should return a number between [0, start]`, () => {
        let tmp: any[] = []
        let start = 200
        let end = 100
        for (let i = 0; i < 200; ++i) {
            tmp.push(numberOf(start))
        }
        assert.deepEqual(tmp.filter(x => x >= start).length, 0)
    })

})

describe('elementOf', () => {
    it(`should return an element from array`, () => {
        let tmp = [...Array(10).keys()].sort()
        let result: any[] = []
        for (let i = 0; i < 200; ++i) {
            result.push(elementOf(tmp))
        }
        assert.deepEqual([...new Set(result)].sort(), tmp)
    })
    it(`should return a field from object`, () => {
        let tmp = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
        let result: any[] = []
        for (let i = 0; i < 200; ++i) {
            result.push(elementOf(tmp))
        }
        assert.deepEqual([...new Set(result)].sort(), Object.values(tmp).sort())
    })
    it(`should return undefined`, () => {
        assert.deepEqual(elementOf(null), undefined)
    })

})

describe('intOf', () => {
    it(`should return a number between [start, end]`, () => {
        let tmp = [...Array(11).keys()].sort()
        let result: any[] = []
        for (let i = 0; i < 200; ++i) {
            result.push(intOf(0, tmp.length - 1))
        }
        assert.deepEqual([...new Set(result)].sort(), tmp)
    })
    it(`should ensure start < end`, () => {
        let tmp = [...Array(11).keys()].sort()
        let result: any[] = []
        for (let i = 0; i < 200; ++i) {
            result.push(intOf(tmp.length - 1, 0))
        }
        assert.deepEqual([...new Set(result)].sort(), tmp)
    })
    it(`should return a number between [0, start]`, () => {
        let tmp = [...Array(11).keys()].sort()
        let result: any[] = []
        for (let i = 0; i < 200; ++i) {
            result.push(intOf(tmp.length - 1))
        }
        assert.deepEqual([...new Set(result)].sort(), tmp)
    })
})

describe('bigintOf', () => {
    it(`should return a number between [start, end]`, () => {
        let tmp = [...Array(11).keys()].map(i => BigInt(i)).sort()
        let result: any[] = []
        for (let i = 0; i < 200; ++i) {
            result.push(bigintOf(BigInt(0), BigInt(tmp.length - 1)))
        }
        result = [...new Set(result)].sort()
        assert.deepEqual(result, tmp)
    })
    it(`should make sure start < end`, () => {
        let tmp = [...Array(11).keys()].map(i => BigInt(i)).sort()
        let result: any[] = []
        for (let i = 0; i < 200; ++i) {
            result.push(bigintOf(BigInt(tmp.length - 1), BigInt(0)))
        }
        result = [...new Set(result)].sort()
        assert.deepEqual(result, tmp)
    })

    it(`should return a number between [0, start]`, () => {
        let tmp = [...Array(11).keys()].sort().map(i => BigInt(i))
        let result: any[] = []
        let start: bigint = BigInt(tmp.length - 1)
        for (let i = 0; i < 200; ++i) {
            result.push(bigintOf(start))
        }
        assert.deepEqual([...new Set(result)].sort(), tmp)
    })
})
