import { path, search } from '../src/search'
import 'mocha'
import { strict as assert } from 'node:assert';

const data = {
    [Symbol.for('some_symbol')]: 12,
    hello: {
        world: 'hello world'
    },
    undefined: undefined,
    null: null,
    bigint: BigInt(1),
    Infinity: Infinity,
    NaN: NaN,
    date: new Date(),
    regexp: /hello/,
    map: new Map(Object.entries({ a: 1, b: 2 })),
    set: new Set(['a', 'b']),
    property: {
        value: 'value',
        path: ['path'],
        search: null
    },
    confusing: {
        value: ['value'],
        path: ['path'],
        search: null
    },
    work: {
        kkk: {
            hello: {
                world: {
                    a: [1, 2, 3],
                    b: ['a', 'b', 'c'],
                    d: [{
                        k: 'k1',
                        z: 'z1'
                    }, {
                        k: 'k2',
                        z: 'z2'
                    }]
                }
            }
        }
    },
    oops: {
        shared: undefined,
        circular: undefined
    }
}
//create shared structure
data.oops.shared = data.work as any
//create circular structure
data.oops.circular = data.oops as any

describe('path', () => {
    it(`should return ${data.work.kkk.hello.world.d[1].k}`, () => {
        assert.deepEqual(path().work.kkk.hello.world.d[1].k(data), [data.work.kkk.hello.world.d[1].k])
    })
    it(`should return ${data.work.kkk.hello.world.a}`, () => {
        assert.deepEqual(path().work.kkk.hello.world.a(data), [data.work.kkk.hello.world.a])
    })
    it(`should return ${data.work.kkk.hello.world.a}`, () => {
        assert.deepEqual(path()('work', 'kkk', 'hello', 'world').a(data), [data.work.kkk.hello.world.a])
    })
    it(`should return ${data.work.kkk.hello.world.a[0]}`, () => {
        assert.deepEqual(path()('work', 'kkk', 'hello', 'world').a(0, data), [data.work.kkk.hello.world.a[0]])
    })
    it(`should return ${data[Symbol.for('some_symbol')]}`, () => {
        assert.deepEqual(path()[Symbol.for('some_symbol')](data), [data[Symbol.for('some_symbol')]])
    })
    it(`should return ${data.work}`, () => {
        assert.deepEqual(path().work()(data), [data.work])
    })

    it(`should return ${data['nothing']}`, () => {
        assert.deepEqual(path().nothing()(data), [])
    })
    it(`should return ${data['undefined']}`, () => {
        assert.deepEqual(path().undefined()(data), [undefined])
    })
    it(`should return ${data['null']}`, () => {
        assert.deepEqual(path().null()(data), [null])
    })
    it(`should return ${data['Infinity']}`, () => {
        assert.deepEqual(path().Infinity()(data), [Infinity])
    })
    it(`should return ${data['NaN']}`, () => {
        assert.deepEqual(path().NaN()(data), [NaN])
    })

})
describe('path', () => {
    it(`should search the 1st children`, () => {
        let tmp = path().work.kkk.hello.world.d(search((obj) => {
            if (typeof obj === 'object' && obj !== null && ('k' in obj) && ('z' in obj)) {
                return obj
            }
        }, 1))(data)
        assert.deepEqual(tmp, [{
            k: 'k1',
            z: 'z1'
        }, {
            k: 'k2',
            z: 'z2'
        }])
    })
    it(`should search the 0th children`, () => {
        let tmp = path().work.kkk.hello.world.d(search((obj) => {
            if (typeof obj === 'object' && obj !== null && ('k' in obj) && ('z' in obj)) {
                return obj
            }
        }, 0))(data)
        assert.deepEqual(tmp, [])
    })

})
describe('path', () => {
    it(`should return ${data.work.kkk.hello.world.a}`, () => {
        assert.deepEqual(path().work((obj) => obj.kkk).hello.world.a(data), [data.work.kkk.hello.world.a])
    })
    it(`should return ${data.work.kkk.hello.world.a}`, () => {
        assert.deepEqual(path().work((obj) => obj.kkk, (obj) => obj.hello).world.a(data), [data.work.kkk.hello.world.a])
    })
    it(`should return ${data.work.kkk.hello.world.a}`, () => {
        assert.deepEqual(path().work((obj) => obj.kkk, (obj) => obj.hello).world.a(data), [data.work.kkk.hello.world.a])
    })
    it(`should return ${data.work.kkk.hello.world.a}`, () => {
        assert.deepEqual(path().work((obj) => obj.kkk).hello((obj) => obj.world).a(data), [data.work.kkk.hello.world.a])
    })
    it(`should return nothing`, () => {
        assert.deepEqual(path().work((obj) => { }).hello((obj) => obj.world).a(data), [])
    })
    it(`should return nothing`, () => {
        assert.deepEqual(path().work((obj) => undefined).hello((obj) => obj.world).a(data), [])
    })
    it(`should return nothing`, () => {
        assert.deepEqual(path().work((obj) => null).hello((obj) => obj.world).a(data), [])
    })
    it(`should return null`, () => {
        assert.deepEqual(path().work((obj) => null)(data), [null])
    })

    it(`should return nothing`, () => {
        assert.deepEqual(path().work((obj) => ({ value: [undefined], path: [], search: null })).hello((obj) => obj.world).a(data), [])
    })
    it(`should return nothing`, () => {
        assert.deepEqual(path().work((obj) => ({ value: [undefined] })).hello((obj) => obj.world).a(data), [])
    })
    it(`should return ${data.property}`, () => {
        assert.deepEqual(path().property((obj) => obj)(data), [data.property])
    })
    it(`should return 'value'`, () => {
        assert.deepEqual(path().confusing((obj) => obj)(data), [data.confusing])
    })
    it(`should search for {k, v}`, () => {
        let tmp = path().work.kkk.hello.world(search((obj) => {
            if (typeof obj === 'object' && obj !== null && ('k' in obj) && ('z' in obj)) {
                return obj
            }
        }))(data)
        assert.deepEqual(tmp, [{
            k: 'k1',
            z: 'z1'
        }, {
            k: 'k2',
            z: 'z2'
        }])
    })
    it(`should search for {k, v}`, () => {
        let tmp = path()(search((obj) => {
            if (typeof obj === 'object' && obj !== null && ('k' in obj) && ('z' in obj)) {
                return obj
            }
        }))((obj) => {
            return [obj.k, obj.z]
        })(data)
        assert.deepEqual(tmp, [['k1', 'z1'], ['k2', 'z2']])
    })
    it(`should search for Map`, () => {
        let tmp = path()(search((obj) => {
            if (obj instanceof Map) {
                return obj
            }
        })).a(data)
        assert.deepEqual(tmp, [1])
    })
    it(`should search for Map`, () => {
        let tmp = path()(data)
        assert.deepEqual(tmp, [data])
    })
})

describe('path', () => {
    it(`should work with environment and variable`, () => {
        let p = path()((obj, env) => {
            env.var('hello')(5)
            return {
                a: 5,
                b: 'kkk'
            }
        })((obj, env) => {
            let v = env.var('hello')
            if (v(obj.a)) {
                return obj
            }
        })
        assert.deepEqual(p({}), [{ a: 5, b: 'kkk' }])
        let pp = p((obj, env) => {
            let v = env.var('hello')
            if (v(obj.b)) {
                return obj
            }
        })
        assert.deepEqual(pp({}), [])
    })
})