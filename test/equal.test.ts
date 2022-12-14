import 'mocha'
import { strict as assert } from 'node:assert';
import { deepEqual } from '../src/deepEqual';



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
    it(`should work with function`, () => {
        let fn = a => a
        assert.equal(deepEqual([{ path: [], expected: 1, actual: fn }], [{ path: [], expected: 1, actual: fn }]), true)
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
    it(`should work with objects A extends B`, () => {
        let A = {
            a: {
                b: {
                    c: {
                        d: {
                            e: {
                                f: 'f'
                            }
                        }
                    }
                }
            },
            A: {
                B: {
                    C: {
                        D: {
                            E: {
                                F: 'F'
                            }
                        }
                    }
                }
            }
        }
        let B = {
            A: {
                B: {
                    C: {
                        D: {
                            E: {
                                F: 'F'
                            }
                        }
                    }
                }
            }
        }
        assert.equal(deepEqual(A, B), false)
        assert.equal(deepEqual(B, A), false)
    })

    it(`should work with Set`, () => {
        assert.equal(deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3])), true)
        assert.equal(deepEqual(new Set([1, 2, 3]), new Set([1, 3, 2])), true)
        assert.equal(deepEqual(new Set([1, 2, 3]), new Set([1, 3])), false)
        assert.equal(deepEqual(new Set([1, 2, 3]), new Set([1, 3, 4])), false)
    })
    it(`should work with Set deeply`, () => {
        assert.equal(deepEqual(new Set([{ a: 1 }, 1, 2]), new Set([1, 2, { a: 1 }])), true)
        assert.equal(deepEqual(new Set([1, { a: 1 }, 3]), new Set([1, 3, { a: 1 }])), true)
        assert.equal(deepEqual(new Set([1, { a: 1 }, 3]), new Set([1, 3, { a: 2 }])), false)
    })
    it(`should work with Set vs. Map`, () => {
        assert.equal(deepEqual(new Set([1, { a: 1 }, 3]), new Map(Object.entries({ a: 1 }))), false)
    })

    it(`should work with Map`, () => {
        assert.equal(deepEqual(new Map(Object.entries({ a: 1, b: 2, c: 3 })), new Map(Object.entries({ a: 1, c: 3, b: 2 }))), true)
        assert.equal(deepEqual(new Map(Object.entries({ a: 1, b: 2, c: 3 })), new Map(Object.entries({ a: 1, c: 3, b: 3 }))), false)
        assert.equal(deepEqual(new Map(Object.entries({ a: 1, b: 2, c: 3 })), new Map(Object.entries({ a: 1, c: 3 }))), false)
    })

})

describe(`deepEqual compares composite values with circular structure`, () => {
    let o1 = {
        a: {
            b: {
                c: {
                    d: [1, 2, 3]
                },
                b: null
            }
        },
        b: null
    }
    o1.b = o1.a.b as any
    o1.a.b.b = o1.a.b as any
    it(`should work with self referencing structure`, () => {
        assert.equal(deepEqual(o1.b, o1.a.b), true)
        assert.equal(deepEqual(o1.a.b.b, o1.a.b), true)
    })
    let o2 = {
        a: {
            b: {
                c: {
                    d: [1, 2, 3]
                },
                b: null
            }
        },
        b: null
    }
    o2.b = o1.a.b as any
    o2.a.b.b = o1.a.b as any
    it(`should work with cross referencing structure`, () => {
        assert.equal(deepEqual(o1, o2), true)
        assert.equal(deepEqual(o2, o1), true)
    })
})
