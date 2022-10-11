import 'mocha'
import { strict as assert } from 'node:assert';
import { match } from '../src/match'
describe('match(pattern)(data)', () => {
    const primitivePattern = (p) => (x, result?: boolean) => {
        if (result === true) {
            assert.deepEqual(Array.from(match(p)(x)), [])
        } else if (result === false) {
            assert.deepEqual(Array.from(match(p)(x)), [{
                path: [],
                expected: p,
                actual: x
            }])

        } else {
            assert.deepEqual(Array.from(match(p)(x)), p === x ? [] : [{
                path: [],
                expected: p,
                actual: x
            }])
        }
    }
    it(`pattern can be number`, () => {
        const diff = primitivePattern(1)
        diff(1)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be string`, () => {
        const diff = primitivePattern('world')
        diff('world')
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be boolean`, () => {
        const diff = primitivePattern(false)
        diff(false)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be bigint`, () => {
        const diff = primitivePattern(BigInt(1))
        diff(BigInt(1))
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be symbol`, () => {
        const diff = primitivePattern(Symbol.for('lll'))
        diff(Symbol.for('lll'))
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be null`, () => {
        const diff = primitivePattern(null)
        diff(null)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be undefined`, () => {
        const diff = primitivePattern(undefined)
        diff(undefined)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)

    })
    it(`pattern can be Date`, () => {
        let dt = new Date()
        let pt = new Date(dt.getTime())
        const diff = primitivePattern(pt)
        diff(dt, true)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(/hello/i)
        let fn = a => a
        diff(fn)

    })
    it(`pattern can be RegExp`, () => {
        const diff = primitivePattern(/world/i)
        diff(/world/i, true)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)

    })

    it(`pattern can be Set`, () => {
        const diff = primitivePattern(new Set([3, 2, 1]))
        diff(new Set([1, 2, 3, 4]), true)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be Map`, () => {
        const diff = primitivePattern(new Map([['a', 1], ['b', 1]]))
        diff(new Map([['a', 1], ['b', 1]]), true)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff([])
        diff(new Set())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)
    })
    it(`pattern can be {}`, () => {
        const diff = primitivePattern({ a: 1, b: 2, c: 3 })
        diff({ a: 1, b: 2, c: 3 }, true)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff([])
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)

    })
    it(`pattern can be []`, () => {
        const diff = primitivePattern([1, 2, 3])
        diff([1, 2, 3], true)
        diff(0)
        diff(undefined)
        diff(null)
        diff('hello')
        diff(Symbol.for('kkk'))
        diff(true)
        diff({})
        diff(new Set())
        diff(new Map())
        diff(new Date())
        diff(/hello/i)
        let fn = a => a
        diff(fn)

    })
})

describe('match(pattern)(data)', () => { })