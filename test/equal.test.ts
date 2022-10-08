import 'mocha'
import { strict as assert } from 'node:assert';
import { deepEqual } from '../src/equal';

describe(`deepEqual compares primitive values`, () => {
    it(`should work with number`, () => {
        assert.equal(deepEqual(1, 1), true)
        assert.equal(deepEqual(1, 2), false)
    })
    it(`NaN should be equal to NaN`, () => {
        assert.equal(deepEqual(NaN, NaN), true)
        assert.equal(deepEqual(1, NaN), false)
        assert.equal(deepEqual(Infinity, NaN), false)
    })
    it(`Infinity should be equal to Infinity`, () => {
        assert.equal(deepEqual(Infinity, Infinity), true)
        assert.equal(deepEqual(Infinity, 1), false)
    })
    it(`should work with boolean`, () => {
        assert.equal(deepEqual(true, true), true)
        assert.equal(deepEqual(false, false), true)
        assert.equal(deepEqual(true, false), false)
        assert.equal(deepEqual(false, true), false)
    })
    it(`should work with string`, () => {
        assert.equal(deepEqual('string', 'string'), true)
        assert.equal(deepEqual('string', 'number'), false)
    })
    it(`should work with bigint`, () => {
        assert.equal(deepEqual(BigInt(1), BigInt(1)), true)
        assert.equal(deepEqual(BigInt(1), BigInt(2)), false)
    })
    it(`should work with symbol`, () => {
        assert.equal(deepEqual(Symbol(), Symbol()), false)
        assert.equal(deepEqual(Symbol.for('var'), Symbol.for('var')), true)
        assert.equal(deepEqual(Symbol.for('var'), Symbol.for('var1')), false)
    })
    it(`should work with undefined and null`, () => {
        assert.equal(deepEqual(Symbol(), null), false)
        assert.equal(deepEqual(undefined, Symbol()), false)
        assert.equal(deepEqual(undefined, null), false)
        assert.equal(deepEqual(null, null), true)
        assert.equal(deepEqual(undefined, undefined), true)
    })
    it(`should work with Date`, () => {
        let date1 = new Date()
        let date2 = new Date(date1.getTime())
        assert.equal(deepEqual(date1, date2), true)
        let date3 = new Date(date1.getTime() + 10)
        assert.equal(deepEqual(date3, date2), false)
    })
    it(`should work with RegExp`, () => {
        assert.equal(deepEqual(/hello/i, /hello/i), true)
        assert.equal(deepEqual(/hello/i, /world/i), false)
    })

})

describe(`deepEqual compares composite values`, () => {
    it(`should work with array`, () => {
        assert.equal(deepEqual([1, 2, 3], [1, 2, 3]), true)
        assert.equal(deepEqual([1, 2, 3], [1, 3, 2]), false)
        assert.equal(deepEqual([1, 2, 3], [1, 3]), false)
    })
    it(`should work with object`, () => {
        assert.equal(deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, c: 3, b: 2 }), true)
        assert.equal(deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, c: 3, b: 3 }), false)
        assert.equal(deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }), false)
    })
    it(`should work with Set`, () => {
        assert.equal(deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3])), true)
        assert.equal(deepEqual(new Set([1, 2, 3]), new Set([1, 3, 2])), false)
        assert.equal(deepEqual(new Set([1, 2, 3]), new Set([1, 3])), false)
    })
    it(`should work with Map`, () => {
        assert.equal(deepEqual(new Map(Object.entries({ a: 1, b: 2, c: 3 })), new Map(Object.entries({ a: 1, c: 3, b: 2 }))), true)
        assert.equal(deepEqual(new Map(Object.entries({ a: 1, b: 2, c: 3 })), new Map(Object.entries({ a: 1, c: 3, b: 3 }))), false)
        assert.equal(deepEqual(new Map(Object.entries({ a: 1, b: 2, c: 3 })), new Map(Object.entries({ a: 1, c: 3 }))), false)
    })

})