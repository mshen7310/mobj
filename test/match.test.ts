import 'mocha'
import { strict as assert } from 'node:assert';
import { variable } from '../src/search';
import { match } from '../src/match'
import { setKey } from '../src/search';
describe('match(pattern)(data) shallow comparison', () => {
    const primitivePattern = (p) => (x, result?: boolean) => {
        if (result === true) {
            assert.deepEqual(Array.from(match(p)(x)), [])
        } else if (result === false) {
            assert.deepEqual(Array.from(match(p)(x)), [{
                path: [],
                type: 'discrepancy',
                expected: p,
                actual: x
            }])

        } else {
            assert.deepEqual(Array.from(match(p)(x)), p === x ? [] : [{
                path: [],
                type: 'discrepancy',
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
        const diff2 = primitivePattern(NaN)
        diff2(NaN, true)
        diff2(Infinity)
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
        diff('world', true)
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

describe('match(pattern)(data) Set comparison', () => {
    const pattern = (p) => (x, difference: any[] = []) => {
        assert.deepEqual(Array.from(match(p)(x)), difference)
    }
    it('pettern contains primitive value', () => {
        const diff = pattern(new Set([1]))
        diff(new Set([1]))
        diff(new Set([1, 2]))
        diff(new Set([{ a: 1 }, 1]))
        diff(new Set([2]), [{
            path: [setKey(0)],
            type: 'missing',
            expected: 1
        }])
        diff(new Set([{ a: 1 }]), [{
            path: [setKey(0)],
            type: 'missing',
            expected: 1
        }])
    })
    it('pettern contains composite value', () => {
        const diff = pattern(new Set([{ a: 1 }]))
        diff(new Set([{ a: 1 }]))
        diff(new Set([{ a: 1 }, 1]))
        diff(new Set([2]), [{
            path: [setKey(0)],
            type: 'missing',
            expected: { a: 1 }
        }])
        diff(new Set([3]), [{
            path: [setKey(0)],
            type: 'missing',
            expected: { a: 1 }
        }])
    })

})

describe('match(pattern)(data) Map comparison', () => {
    const pattern = (p) => (x, difference: any[] = []) => {
        assert.deepEqual(Array.from(match(p)(x)), difference)
    }
    it('pattern contains primitive values', () => {
        const diff = pattern(new Map([['a', 1]]))
        diff(new Map([['a', 1]]))
        diff(new Map([['a', 1], ['b', 1]]))
        diff(new Map([['b', 1], ['a', 1]]))
        diff(new Map([]), [{
            path: ['a'],
            type: 'missing',
            expected: 1
        }])
        diff(new Map([['a', 2]]), [{
            path: ['a'],
            type: 'discrepancy',
            expected: 1,
            actual: 2
        }])

    })
    it('pettern contains composite value', () => {
        const diff = pattern(new Map(Object.entries({ a: [1, 2, 3] })))
        diff(new Map(Object.entries({ a: [1, 2, 3] })))
        diff(new Map(Object.entries({ a: [1, 2, 3], b: 3 })))
        diff(new Map([['a', 2]]), [{
            path: ['a'],
            type: 'discrepancy',
            expected: [1, 2, 3],
            actual: 2
        }])
        diff(new Map([]), [{
            path: ['a'],
            type: 'missing',
            expected: [1, 2, 3]
        }])
    })


})

describe('match(pattern)(data) object comparison', () => {
    const pattern = (p) => (x, difference: any[] = []) => {
        assert.deepEqual(Array.from(match(p)(x)), difference)
    }
    it('pattern contains primitive values', () => {
        const diff = pattern({ a: 1, b: true })
        diff({ a: 1, b: true })
        diff({ a: 1, b: true, c: {} })
        diff({ c: 'string', a: 1, b: true })
        diff({ a: 1 }, [{
            path: ['b'],
            type: 'missing',
            expected: true
        }])
        diff({ a: 2 }, [{
            path: ['a'],
            type: 'discrepancy',
            expected: 1,
            actual: 2
        }, {
            path: ['b'],
            type: 'missing',
            expected: true
        }])

    })
    it('pettern contains composite value', () => {
        const diff = pattern({ a: [1, 2, 3] })
        diff({ a: [1, 2, 3] })
        diff({ a: [1, 2, 3], b: 3 })
        diff({ a: 2 }, [{
            path: ['a'],
            type: 'discrepancy',
            expected: [1, 2, 3],
            actual: 2
        }])
        diff({}, [{
            path: ['a'],
            type: 'missing',
            expected: [1, 2, 3]
        }])
    })

})

describe('match(pattern)(data) array comparison', () => {
    const pattern = (p) => (x, difference: any[] = []) => {
        assert.deepEqual(Array.from(match(p)(x)), difference)
    }
    it('pattern contains primitive values', () => {
        const diff = pattern([1, 2, 3])
        diff([1, 2, 3])
        diff([1, 2, 3, 'a'])
        diff([1, 2, 3, {}])
        diff([1, 3, 'A'], [{
            path: [1],
            type: 'discrepancy',
            expected: 2,
            actual: 3
        }, {
            path: [2],
            type: 'discrepancy',
            expected: 3,
            actual: 'A'
        }])
        diff([{}, 2, 3, 5], [{
            path: [0],
            type: 'discrepancy',
            expected: 1,
            actual: {}
        }])

    })
    it('pettern contains composite value', () => {
        const diff = pattern([[1, 2], { a: 1, b: 2 }, {}])
        diff([[1, 2], { a: 1, b: 2 }, {}])
        diff([[1, 2], { a: 1, b: 2 }, {}, 'p'])
        diff([1], [{
            path: [0],
            type: 'discrepancy',
            expected: [1, 2],
            actual: 1
        }, {
            path: [1],
            type: 'missing',
            expected: { a: 1, b: 2 }
        }, {
            path: [2],
            type: 'missing',
            expected: {}
        }])
        diff([{}, 2, 3, 5], [{
            path: [0],
            type: 'discrepancy',
            expected: [1, 2],
            actual: {}
        }, {
            path: [1],
            type: 'discrepancy',
            expected: { a: 1, b: 2 },
            actual: 2
        }, {
            path: [2],
            type: 'discrepancy',
            expected: {},
            actual: 3
        }])
    })

})

describe('match(pattern)(data) function comparison', () => {
    const pattern = (p) => (x, difference: any[] = []) => {
        assert.deepEqual(Array.from(match(p)(x)), difference)
    }
    it('pattern contains primitive values', () => {
        let fn = (x) => x === 2
        const diff = pattern([
            match([1, 2]),
            {
                a: 1,
                b: [
                    1,
                    fn
                ]
            },
            {}
        ])
        diff([[1, 2], { a: 1, b: [1, 2, 3] }, {}])
        diff([[1, 2], { a: 1, b: [1, 2, 4] }, {}, 'p'])
        diff(['p', { a: 1, b: [1, 3, 4] }, {}, 'p'], [{
            path: [0],
            type: 'discrepancy',
            expected: [1, 2],
            actual: 'p'
        }, {
            path: [1, 'b', 1],
            type: 'discrepancy',
            expected: fn,
            actual: 3,
            info: '(x) => x === 2'
        }])

    })
})
describe('match(pattern)(data) work with variable', () => {
    it('should unify variable to concret value', () => {
        const pattern = (p) => (x, difference: any[] = []) => {
            assert.deepEqual(Array.from(match(p)(x)), difference)
        }
        let fn = variable()
        const diff = pattern([
            [1, 2],
            {
                b: fn
            }
        ])
        diff([[1, 2], { a: 1, b: [1, 2, 3] }, {}])
        assert.deepEqual(fn['empty'], false)
        assert.deepEqual(fn['value'], [1, 2, 3])

    })
})

// describe('Adapter Testing match.js', function () {
//     it('should work on composed predicate', function () {
//         assert.ok(match(1, match.not({})));
//         assert.ok(match(1, match.or({}, 1)));
//         assert.ok(match(2.0, match.not({})));
//         assert.ok(match(undefined, match.optional({})));
//         assert.ok(match({}, match.optional({})));
//         assert.ok(match('a', match.and(match.string, 'a')));
//     });
//     it('should work on optional predicates', function () {
//         assert.ok(match([], []));
//         assert.ok(match([], match.is_array));
//         assert.ok(!match(undefined, match.is_array));
//         assert.ok(!match(undefined, []));
//         assert.ok(match(undefined, match.optional(match.is_array)));
//         assert.ok(match(undefined, match.optional([])));
//     });

//     it('should work on any and none predicates', function () {
//         assert.ok(match([], match.any([], {}, 1, 2)));
//         assert.ok(!match([], match.none([], {})));
//         assert.ok(match([], match.all(x => typeof x == 'object', match.is_array)));
//     });
// });

