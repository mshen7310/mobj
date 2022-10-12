import 'mocha'
import { strict as assert } from 'node:assert';
import { and, match, not, or } from '../src/match'

describe('match', () => {
    it(`should work with primitives`, () => {
        let m = match(1)
        assert.equal(m(1), true)
        assert.equal(m(2), false)
        assert.equal(m(NaN), false)
        assert.equal(m(Infinity), false)
        assert.equal(m(true), false)
        assert.equal(m(false), false)
        assert.equal(m({}), false)
        assert.equal(m(), false)
        assert.equal(m([]), false)
        assert.equal(m(undefined), false)
        assert.equal(m(null), false)
        assert.equal(m(new Date()), false)
        assert.equal(m(/hello/i), false)
        assert.equal(m('hello'), false)
        assert.equal(m(Symbol()), false)
        assert.equal(m(BigInt(1)), false)
        assert.equal(m(BigInt(2)), false)
        let nn = not(not(m))
        assert.equal(nn(1), true)
        assert.equal(nn(2), false)
        assert.equal(nn(NaN), false)
        assert.equal(nn(Infinity), false)
        assert.equal(nn(true), false)
        assert.equal(nn(false), false)
        assert.equal(nn({}), false)
        assert.equal(nn(), false)
        assert.equal(nn([]), false)
        assert.equal(nn(undefined), false)
        assert.equal(nn(null), false)
        assert.equal(nn(new Date()), false)
        assert.equal(nn(/hello/i), false)
        assert.equal(nn('hello'), false)
        assert.equal(nn(Symbol()), false)
        assert.equal(nn(BigInt(1)), false)
        assert.equal(nn(BigInt(2)), false)
        let a = and(m, nn)
        assert.equal(a(1), true)
        assert.equal(a(2), false)
        assert.equal(a(NaN), false)
        assert.equal(a(Infinity), false)
        assert.equal(a(true), false)
        assert.equal(a(false), false)
        assert.equal(a({}), false)
        assert.equal(a(), false)
        assert.equal(a([]), false)
        assert.equal(a(undefined), false)
        assert.equal(a(null), false)
        assert.equal(a(new Date()), false)
        assert.equal(a(/hello/i), false)
        assert.equal(a('hello'), false)
        assert.equal(a(Symbol()), false)
        assert.equal(a(BigInt(1)), false)
        assert.equal(a(BigInt(2)), false)
        let o = or(m, nn)
        assert.equal(o(1), true)
        assert.equal(o(2), false)
        assert.equal(o(NaN), false)
        assert.equal(o(Infinity), false)
        assert.equal(o(true), false)
        assert.equal(o(false), false)
        assert.equal(o({}), false)
        assert.equal(o(), false)
        assert.equal(o([]), false)
        assert.equal(o(undefined), false)
        assert.equal(o(null), false)
        assert.equal(o(new Date()), false)
        assert.equal(o(/hello/i), false)
        assert.equal(o('hello'), false)
        assert.equal(o(Symbol()), false)
        assert.equal(o(BigInt(1)), false)
        assert.equal(o(BigInt(2)), false)
    })
})