import 'mocha'
import { strict as assert } from 'node:assert';
import { mapKey, setKey } from '../src/children';
import { diff, diffInfo } from '../src/diff'
import { DifferenceType } from '../src/discriminator';
describe(`diff`, () => {
    it(`should compare number`, () => {
        assert.deepEqual(Array.from(diff(1, 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: 1,
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(1, 1)), [])
        assert.deepEqual(Array.from(diff(1, undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: 1,
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, 1)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: 1,
            info: diffInfo
        }])

    })
    it(`should compare boolean`, () => {

        assert.deepEqual(Array.from(diff(true, 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: true,
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(false, false)), [])
        assert.deepEqual(Array.from(diff(false, true)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: false,
            actual: true,
            info: diffInfo
        }])

        assert.deepEqual(Array.from(diff(false, undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: false,
            actual: undefined,
            info: diffInfo

        }])
    })
    it(`should compare string`, () => {
        assert.deepEqual(Array.from(diff('string', 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: 'string',
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff('string', 'string')), [])
        assert.deepEqual(Array.from(diff(1, 'string')), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: 1,
            actual: 'string',
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, 'string')), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: 'string',
            info: diffInfo
        }])
    })
    it(`should compare bigint`, () => {
        assert.deepEqual(Array.from(diff(1, 2n)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: 1,
            actual: 2n,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(1n, 1n)), [])
        assert.deepEqual(Array.from(diff(1n, undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: 1n,
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, 1n)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: 1n,
            info: diffInfo
        }])
    })
    it(`should compare symbol`, () => {
        assert.deepEqual(Array.from(diff(Symbol.for('x'), 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: Symbol.for('x'),
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(Symbol.for('x'), Symbol.for('x'))), [])
        assert.deepEqual(Array.from(diff(Symbol.for('x'), undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: Symbol.for('x'),
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, Symbol.for('x'))), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: Symbol.for('x'),
            info: diffInfo
        }])

    })
    it(`should compare undefined`, () => {
        assert.deepEqual(Array.from(diff(undefined, undefined)), [])
        assert.deepEqual(Array.from(diff(Symbol.for('x'), undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: Symbol.for('x'),
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, Symbol.for('x'))), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: Symbol.for('x'),
            info: diffInfo
        }])
    })
    it(`should compare function`, () => {
        let fn = () => { }
        assert.deepEqual(Array.from(diff(fn, 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: fn,
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(fn, fn)), [])
        assert.deepEqual(Array.from(diff(fn, undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: fn,
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, fn)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: fn,
            info: diffInfo
        }])
    })
    it(`should compare {}`, () => {
        assert.deepEqual(Array.from(diff({}, 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: {},
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff({}, null)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: {},
            actual: null,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff({ a: 1 }, {})), [{
            path: ['a'],
            type: DifferenceType.Absence,
            expected: 1,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff({ a: 1 }, { a: 1, b: 2 })), [{
            path: ['b'],
            type: DifferenceType.Redundancy,
            actual: 2,
            info: diffInfo
        }])

        assert.deepEqual(Array.from(diff({}, {})), [])
        assert.deepEqual(Array.from(diff({}, undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: {},
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, {})), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: {},
            info: diffInfo
        }])
    })
    it(`should compare []`, () => {
        assert.deepEqual(Array.from(diff([], 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: [],
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff([1], [1, 2])), [{
            path: [1],
            type: DifferenceType.Redundancy,
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff([1, 2, 3], [1, 2])), [{
            path: [2],
            type: DifferenceType.Absence,
            expected: 3,
            info: diffInfo
        }])

        assert.deepEqual(Array.from(diff([1], [1])), [])
        assert.deepEqual(Array.from(diff([], undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: [],
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, [])), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: [],
            info: diffInfo
        }])
    })
    it(`should compare Set`, () => {
        assert.deepEqual(Array.from(diff(new Set([1]), 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: new Set([1]),
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(new Set([1]), new Set([1]))), [])
        assert.deepEqual(Array.from(diff(new Set([1]), undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: new Set([1]),
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, new Set([1]))), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: new Set([1]),
            info: diffInfo
        }])
    })
    it(`should compare Map`, () => {
        assert.deepEqual(Array.from(diff(new Map([[1, 1]]), 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: new Map([[1, 1]]),
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(new Map([[1, 1]]), new Map([[1, 1]]))), [])
        assert.deepEqual(Array.from(diff(new Map([['a', 1]]), new Map([]))), [{
            path: [mapKey('a')],
            type: DifferenceType.Absence,
            expected: 1,
            info: diffInfo
        }])

        assert.deepEqual(Array.from(diff(new Map([['a', 1]]), new Map([['a', 1], ['b', 2]]))), [{
            path: [mapKey('b')],
            type: DifferenceType.Redundancy,
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(new Map([[1, 1]]), undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: new Map([[1, 1]]),
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, new Map([[1, 1]]))), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: new Map([[1, 1]]),
            info: diffInfo
        }])
    })
    it(`should compare null`, () => {
        assert.deepEqual(Array.from(diff(null, 2)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: null,
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(null, null)), [])
        assert.deepEqual(Array.from(diff(null, undefined)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: null,
            actual: undefined,
            info: diffInfo

        }])
        assert.deepEqual(Array.from(diff(undefined, null)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: undefined,
            actual: null,
            info: diffInfo
        }])
    })
    it(`should compare Date`, () => {
        let dt1 = new Date()
        let dt2 = new Date(dt1.getTime())
        let dt3 = new Date(dt1.getTime() + 1)
        assert.deepEqual(Array.from(diff(dt1, dt2)), [])
        assert.deepEqual(Array.from(diff(dt1, dt3)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: dt1,
            actual: dt3,
            info: diffInfo
        }])
    })
    it(`should compare RegExp`, () => {
        let dt1 = /hello/i
        let dt2 = /hello/i
        let dt3 = /world/
        assert.deepEqual(Array.from(diff(dt1, dt2)), [])
        assert.deepEqual(Array.from(diff(dt1, dt3)), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: dt1,
            actual: dt3,
            info: diffInfo
        }])
    })
    it(`should compare Buffer`, () => {
        assert.deepEqual(Array.from(diff(Buffer.from('hello'), Buffer.from('world'))), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: Buffer.from('hello'),
            actual: Buffer.from('world'),
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(Buffer.from('hello'), Buffer.from('hello'))), [])
    })
    it(`should compare TypedArray`, () => {
        assert.deepEqual(Array.from(diff(Int16Array.from([1, 2, 3, 4, 5, 6]), Int16Array.from([1, 2, 3, 4, 5, 6]))), [])
        assert.deepEqual(Array.from(diff(Int16Array.from([1, 2, 3, 4, 5]), Int16Array.from([1, 2, 3, 4, 5, 6]))), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: Int16Array.from([1, 2, 3, 4, 5]),
            actual: Int16Array.from([1, 2, 3, 4, 5, 6]),
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(Int16Array.from([1, 2, 3, 4, 7, 6]), Int16Array.from([1, 2, 3, 4, 5, 6]))), [{
            path: [],
            type: DifferenceType.Discrepancy,
            expected: Int16Array.from([1, 2, 3, 4, 7, 6]),
            actual: Int16Array.from([1, 2, 3, 4, 5, 6]),
            info: diffInfo
        }])

    })
    it(`should compare object/array/Set/Map`, () => {
        const data1 = {
            a: {
                b: {
                    c: ['hello']
                }
            },
            b: [
                1, {
                    a: 'hello',
                    b: new Set([
                        {
                            a: 1
                        },
                        1,
                        [
                            {
                                a: 1
                            }
                        ]
                    ])
                }
            ],
            c: new Map(Object.entries({
                a: 1,
                b: {
                    a: 1
                }
            }))
        }
        const data2 = {
            a: {
                b: {
                    c: ['hello']
                }
            },
            b: [
                1, {
                    a: 'hello',
                    b: new Set([
                        {
                            a: 1
                        },
                        1,
                        [
                            {
                                a: 2
                            }
                        ]
                    ])
                }
            ],
            c: new Map(Object.entries({
                a: 1,
                b: {
                    a: 2
                }
            }))
        }
        assert.deepEqual(Array.from(diff(data1, data2)), [{
            path: ['b', 1, 'b', setKey([{ a: 1 }])],
            type: DifferenceType.Absence,
            expected: [{ a: 1 }],
            info: diffInfo
        }, {
            path: ['b', 1, 'b', setKey([{ a: 2 }])],
            type: DifferenceType.Redundancy,
            actual: [{ a: 2 }],
            info: diffInfo
        }, {
            path: ['c', mapKey('b'), 'a'],
            type: DifferenceType.Discrepancy,
            expected: 1,
            actual: 2,
            info: diffInfo
        }])
        assert.deepEqual(Array.from(diff(data2, data1)), [{
            path: ['b', 1, 'b', setKey([{ a: 2 }])],
            type: DifferenceType.Absence,
            expected: [{ a: 2 }],
            info: diffInfo
        }, {
            path: ['b', 1, 'b', setKey([{ a: 1 }])],
            type: DifferenceType.Redundancy,
            actual: [{ a: 1 }],
            info: diffInfo
        }, {
            path: ['c', mapKey('b'), 'a'],
            type: DifferenceType.Discrepancy,
            expected: 2,
            actual: 1,
            info: diffInfo
        }])

    })
})