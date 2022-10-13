import { filter, map, isGenerator, chain, mapFilter, children, iterators, setKey, mapKey } from '../src/gonad'
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

describe('iterators', () => {
    let ite = iterators([RegExp, function* (obj: RegExp) {
        yield ['source', [obj.source, obj.flags]]
    }])
    let ite2 = iterators([RegExp, function* (obj: RegExp) {
        yield ['source', [obj.source, obj.flags]]
    }], function* (obj: Date) {
        yield ['world', ['date', 1]]
    })
    let c1 = children()
    let c2 = children(1, ite)
    let c3 = children(Infinity, ite)
    let c4 = children(Infinity, ite2)
    it(`default configuration`, () => {
        let obj = [/hello/i]
        assert.deepEqual(Array.from(c1(obj)).map(x => x.slice(1)), [
            [[], obj],
            [[0], /hello/i]
        ])
    })
    it(`default depth === 1`, () => {
        let obj = [/hello/i]
        assert.deepEqual(Array.from(c2(obj)).map(x => x.slice(1)), [
            [[], obj],
            [[0], /hello/i]
        ])
    })
    it(`default depth === Infinity`, () => {
        let obj = [/hello/i]
        assert.deepEqual(Array.from(c3(obj)).map(x => x.slice(1)), [
            [[], obj],
            [[0], /hello/i],
            [[0, 'source'], ['hello', 'i']],
        ])
    })
    it(`default depth === Infinity with fallback iterator`, () => {
        let obj = [/hello/i]
        assert.deepEqual(Array.from(c3(obj)).map(x => x.slice(1)), [
            [[], obj],
            [[0], /hello/i],
            [[0, 'source'], ['hello', 'i']],
        ])
    })
    it(`default depth === Infinity with fallback iterator`, () => {
        let dt = new Date()
        let obj = [/hello/i, dt]
        assert.deepEqual(Array.from(c4(obj)).map(x => x.slice(1)), [
            [[], obj],
            [[0], /hello/i],
            [[0, 'source'], ['hello', 'i']],
            [[1], dt],
            [[1, 'world'], ['date', 1]],
        ])
    })

})
describe('children', function () {
    let c = children()
    it(`number`, () => {
        assert.deepEqual(Array.from(c(1))[0].slice(1), [[], 1])
        assert.deepEqual(Array.from(c(NaN))[0].slice(1), [[], NaN])
        assert.deepEqual(Array.from(c(Infinity))[0].slice(1), [[], Infinity])
    })
    it(`boolean`, () => {
        assert.deepEqual(Array.from(c(true))[0].slice(1), [[], true])
        assert.deepEqual(Array.from(c(false))[0].slice(1), [[], false])
    })
    it(`string`, () => {
        assert.deepEqual(Array.from(c('hello'))[0].slice(1), [[], 'hello'])
    })
    it(`symbol`, () => {
        assert.deepEqual(Array.from(c(Symbol.for('x')))[0].slice(1), [[], Symbol.for('x')])
    })
    it(`bigint`, () => {
        assert.deepEqual(Array.from(c(BigInt(1)))[0].slice(1), [[], BigInt(1)])
    })
    it(`undefined`, () => {
        assert.deepEqual(Array.from(c(undefined))[0].slice(1), [[], undefined])
    })
    it(`nothing`, () => {
        assert.deepEqual(Array.from(c())[0].slice(1), [[]])
    })
    it(`null`, () => {
        assert.deepEqual(Array.from(c(null))[0].slice(1), [[], null])
    })
    it(`function`, () => {
        let fn = a => a
        assert.deepEqual(Array.from(c(fn))[0].slice(1), [[], fn])
    })
    it(`Date`, () => {
        let dt = new Date()
        assert.deepEqual(Array.from(c(dt))[0].slice(1), [[], dt])
    })
    it(`RegExp`, () => {
        let re = /hello/i
        assert.deepEqual(Array.from(c(re))[0].slice(1), [[], re])
    })
    it(`[]`, () => {
        assert.deepEqual(Array.from(c([]))[0].slice(1), [[], []])
    })
    it(`[1,2]`, () => {
        assert.deepEqual(Array.from(c([1, 2])).map(x => x.slice(1)), [
            [[], [1, 2]],
            [[0], 1],
            [[1], 2]
        ])
    })
    it(`{}`, () => {
        assert.deepEqual(Array.from(c({})).map(x => x.slice(1)), [
            [[], {}]
        ])
    })
    it(`{a:1, b:'hello'}`, () => {
        assert.deepEqual(Array.from(c({ a: 1, b: 'hello' })).map(x => x.slice(1)), [
            [[], { a: 1, b: 'hello' }],
            [['a'], 1],
            [['b'], 'hello'],
        ])
    })

    it(`Set`, () => {
        let set = new Set([1, {}])
        assert.deepEqual(Array.from(c(set)).map(x => x.slice(1)), [
            [[], set],
            [[setKey(0)], 1],
            [[setKey(1)], {}],
        ])
    })
    it(`Map`, () => {
        let map = new Map([[1, {}], [2, { a: 1 }]])
        assert.deepEqual(Array.from(c(map)).map(x => x.slice(1)), [
            [[], map],
            [[mapKey(1)], {}],
            [[mapKey(2)], { a: 1 }],
            [[mapKey(2), 'a'], 1],
        ])
    })
    it('{set:Set, map:Map, array:[1, {a:1}]}', () => {
        let set = new Set([1])
        let map = new Map([['k', 'v']])
        let array = [1, { a: 1 }]
        const obj = {
            set,
            map,
            array,
        }
        assert.deepEqual(Array.from(c(obj)).map(x => x.slice(1)), [
            [[], obj],
            [['set'], set],
            [['set', setKey(0)], 1],
            [['map'], map],
            [['map', mapKey('k')], 'v'],
            [['array'], array],
            [['array', 0], 1],
            [['array', 1], { a: 1 }],
            [['array', 1, 'a'], 1],
        ])
    })
})