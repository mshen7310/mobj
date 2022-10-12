import 'mocha'
import { strict as assert } from 'node:assert';
import { variable } from '../src/diff';

describe(`Variable should match anything`, () => {
    let date = new Date()
    let var_number = variable()
    let var_Infinity = variable()
    let var_NaN = variable()
    let var_true = variable()
    let var_false = variable()
    let var_object = variable()
    let var_array = variable()
    let var_string = variable()
    let var_bigint = variable()
    let var_regexp = variable()
    let var_date = variable()
    let var_null = variable()
    let var_symbol = variable()
    let var_undefined = variable()
    it(`1`, () => {
        assert.equal(var_number(1), true)
    })
    it(`Infinity`, () => {
        assert.equal(var_Infinity(Infinity), true)
    })
    it(`NaN`, () => {
        assert.equal(var_NaN(NaN), true)
    })
    it(`true`, () => {
        assert.equal(var_true(true), true)
    })
    it(`false`, () => {
        assert.equal(var_false(false), true)
    })
    it(`{}`, () => {
        assert.equal(var_object({}), true)
    })
    it(`[]`, () => {
        assert.equal(var_array([]), true)
    })
    it(`string`, () => {
        assert.equal(var_string('string'), true)
    })
    it(`bigint`, () => {
        assert.equal(var_bigint(BigInt(1)), true)
    })
    it(`regexp`, () => {
        assert.equal(var_regexp(/hello/i), true)
    })
    it(`date`, () => {
        assert.equal(var_date(date), true)
    })
    it(`null`, () => {
        assert.equal(var_null(null), true)
    })
    it(`symbol`, () => {
        assert.equal(var_symbol(Symbol.for('var_symbol')), true)
    })
    it(`undefined`, () => {
        assert.equal(var_undefined(undefined), true)
    })
})
describe(`Variable shoud NOT match different thing`, () => {
    let date = new Date()
    let var_number = variable()
    let var_Infinity = variable()
    let var_NaN = variable()
    let var_true = variable()
    let var_false = variable()
    let var_object = variable()
    let var_array = variable()
    let var_string = variable()
    let var_bigint = variable()
    let var_regexp = variable()
    let var_date = variable()
    let var_null = variable()
    let var_symbol = variable()
    let var_undefined = variable()
    it(`1`, () => {
        assert.equal(var_number(1), true)
        assert.equal(var_number(2), false)
    })
    it(`Infinity`, () => {
        assert.equal(var_Infinity(Infinity), true)
        assert.equal(var_Infinity(2), false)
    })
    it(`NaN`, () => {
        assert.equal(var_NaN(NaN), true)
        assert.equal(var_NaN(2), false)
    })
    it(`true`, () => {
        assert.equal(var_true(true), true)
        assert.equal(var_true(2), false)
    })
    it(`false`, () => {
        assert.equal(var_false(false), true)
        assert.equal(var_false(2), false)
    })
    it(`{}`, () => {
        assert.equal(var_object({}), true)
        assert.equal(var_object(2), false)
    })
    it(`[]`, () => {
        assert.equal(var_array([]), true)
        assert.equal(var_array(2), false)
    })
    it(`string`, () => {
        assert.equal(var_string('string'), true)
        assert.equal(var_string(''), false)
    })
    it(`bigint`, () => {
        assert.equal(var_bigint(BigInt(1)), true)
        assert.equal(var_bigint(BigInt(2)), false)
    })
    it(`regexp`, () => {
        assert.equal(var_regexp(/hello/i), true)
        assert.equal(var_regexp(/2/i), false)
    })
    it(`date`, () => {
        assert.equal(var_date(date), true)
        assert.equal(var_date(2), false)
    })
    it(`null`, () => {
        assert.equal(var_null(null), true)
        assert.equal(var_null(2), false)
    })
    it(`symbol`, () => {
        assert.equal(var_symbol(Symbol.for('var_symbol')), true)
        assert.equal(var_symbol(2), false)
    })
    it(`undefined`, () => {
        assert.equal(var_undefined(undefined), true)
        assert.equal(var_undefined(2), false)
    })
})
describe(`Variable shoud match the same thing`, () => {
    let date = new Date()
    let var_number = variable()
    let var_Infinity = variable()
    let var_NaN = variable()
    let var_true = variable()
    let var_false = variable()
    let var_object = variable()
    let var_array = variable()
    let var_string = variable()
    let var_bigint = variable()
    let var_regexp = variable()
    let var_date = variable()
    let var_null = variable()
    let var_symbol = variable()
    let var_undefined = variable()
    it(`1`, () => {
        assert.equal(var_number(1), true)
        assert.equal(var_number(1), true)
    })
    it(`Infinity`, () => {
        assert.equal(var_Infinity(Infinity), true)
        assert.equal(var_Infinity(Infinity), true)
    })
    it(`NaN`, () => {
        assert.equal(var_NaN(NaN), true)
        assert.equal(var_NaN(NaN), true)
    })
    it(`true`, () => {
        assert.equal(var_true(true), true)
        assert.equal(var_true(true), true)
    })
    it(`false`, () => {
        assert.equal(var_false(false), true)
        assert.equal(var_false(false), true)
    })
    it(`{}`, () => {
        assert.equal(var_object({}), true)
        assert.equal(var_object({}), true)
    })
    it(`[]`, () => {
        assert.equal(var_array([]), true)
        assert.equal(var_array([]), true)
    })
    it(`string`, () => {
        assert.equal(var_string('string'), true)
        assert.equal(var_string('string'), true)
    })
    it(`bigint`, () => {
        assert.equal(var_bigint(BigInt(1)), true)
        assert.equal(var_bigint(BigInt(1)), true)
    })
    it(`regexp`, () => {
        assert.equal(var_regexp(/hello/i), true)
        assert.equal(var_regexp(/hello/i), true)
    })
    it(`date`, () => {
        assert.equal(var_date(date), true)
        assert.equal(var_date(date), true)
    })
    it(`null`, () => {
        assert.equal(var_null(null), true)
        assert.equal(var_null(null), true)
    })
    it(`symbol`, () => {
        assert.equal(var_symbol(Symbol.for('var_symbol')), true)
        assert.equal(var_symbol(Symbol.for('var_symbol')), true)
    })
    it(`undefined`, () => {
        assert.equal(var_undefined(undefined), true)
        assert.equal(var_undefined(undefined), true)
    })
})
describe(`Variable should return the matched value from 'value' property`, () => {
    let date = new Date()
    let var_number = variable()
    let var_Infinity = variable()
    let var_NaN = variable()
    let var_true = variable()
    let var_false = variable()
    let var_object = variable()
    let var_array = variable()
    let var_string = variable()
    let var_bigint = variable()
    let var_regexp = variable()
    let var_date = variable()
    let var_null = variable()
    let var_symbol = variable()
    let var_undefined = variable()
    function get_value(v: any) {
        return v.value
    }
    it(`1`, () => {
        assert.equal(var_number(1), true)
        assert.equal(get_value(var_number), 1)
        assert.equal(get_value(var_number), var_number.value)
    })
    it(`Infinity`, () => {
        assert.equal(var_Infinity(Infinity), true)
        assert.equal(get_value(var_Infinity), Infinity)
        assert.equal(get_value(var_Infinity), var_Infinity.value)
    })
    it(`NaN`, () => {
        assert.equal(var_NaN(NaN), true)
        assert.equal(get_value(var_NaN), NaN)
        assert.equal(get_value(var_NaN), var_NaN.value)
    })
    it(`true`, () => {
        assert.equal(var_true(true), true)
        assert.equal(get_value(var_true), true)
        assert.equal(get_value(var_true), var_true.value)

    })
    it(`false`, () => {
        assert.equal(var_false(false), true)
        assert.equal(get_value(var_false), false)
        assert.equal(get_value(var_false), var_false.value)

    })
    it(`{}`, () => {
        assert.equal(var_object({}), true)
        assert.deepEqual(get_value(var_object), {})
        assert.equal(get_value(var_object), var_object.value)

    })
    it(`[]`, () => {
        assert.equal(var_array([]), true)
        assert.deepEqual(get_value(var_array), [])
        assert.equal(get_value(var_array), var_array.value)

    })
    it(`string`, () => {
        assert.equal(var_string('string'), true)
        assert.equal(get_value(var_string), 'string')
        assert.equal(get_value(var_string), var_string.value)

    })
    it(`bigint`, () => {
        assert.equal(var_bigint(BigInt(1)), true)
        assert.equal(get_value(var_bigint), BigInt(1))
        assert.equal(get_value(var_bigint), var_bigint.value)

    })
    it(`regexp`, () => {
        assert.equal(var_regexp(/hello/i), true)
        assert.deepEqual(get_value(var_regexp), /hello/i)
        assert.equal(get_value(var_regexp), var_regexp.value)

    })
    it(`date`, () => {
        assert.equal(var_date(date), true)
        assert.equal(get_value(var_date), date)
        assert.equal(get_value(var_date), var_date.value)

    })
    it(`null`, () => {
        assert.equal(var_null(null), true)
        assert.equal(get_value(var_null), null)
        assert.equal(get_value(var_null), var_null.value)

    })
    it(`symbol`, () => {
        assert.equal(var_symbol(Symbol.for('var_symbol')), true)
        assert.equal(get_value(var_symbol), Symbol.for('var_symbol'))
        assert.equal(get_value(var_symbol), var_symbol.value)

    })
    it(`undefined`, () => {
        assert.equal(var_undefined(undefined), true)
        assert.equal(get_value(var_undefined), undefined)
        assert.equal(get_value(var_undefined), var_undefined.value)

    })
})
describe(`Variable should be empty before match and non-empty after match`, () => {
    let date = new Date()
    let var_number = variable()
    let var_Infinity = variable()
    let var_NaN = variable()
    let var_true = variable()
    let var_false = variable()
    let var_object = variable()
    let var_array = variable()
    let var_string = variable()
    let var_bigint = variable()
    let var_regexp = variable()
    let var_date = variable()
    let var_null = variable()
    let var_symbol = variable()
    let var_undefined = variable()
    function get_value(v: any) {
        return !v.empty
    }
    it(`1`, () => {
        assert.equal(get_value(var_number), false)
        assert.equal(var_number(1), true)
        assert.equal(get_value(var_number), true)
    })
    it(`Infinity`, () => {
        assert.equal(get_value(var_Infinity), false)
        assert.equal(var_Infinity(Infinity), true)
        assert.equal(get_value(var_Infinity), true)
    })
    it(`NaN`, () => {
        assert.equal(get_value(var_NaN), false)
        assert.equal(var_NaN(NaN), true)
        assert.equal(get_value(var_NaN), true)
    })
    it(`true`, () => {
        assert.equal(get_value(var_true), false)
        assert.equal(var_true(true), true)
        assert.equal(get_value(var_true), true)
    })
    it(`false`, () => {
        assert.equal(get_value(var_false), false)
        assert.equal(var_false(false), true)
        assert.equal(get_value(var_false), true)
    })
    it(`{}`, () => {
        assert.equal(get_value(var_object), false)
        assert.equal(var_object({}), true)
        assert.deepEqual(get_value(var_object), true)
    })
    it(`[]`, () => {
        assert.equal(get_value(var_array), false)
        assert.equal(var_array([]), true)
        assert.deepEqual(get_value(var_array), true)
    })
    it(`string`, () => {
        assert.equal(get_value(var_string), false)
        assert.equal(var_string('string'), true)
        assert.equal(get_value(var_string), true)
    })
    it(`bigint`, () => {
        assert.equal(get_value(var_bigint), false)
        assert.equal(var_bigint(BigInt(1)), true)
        assert.equal(get_value(var_bigint), true)
    })
    it(`regexp`, () => {
        assert.equal(get_value(var_regexp), false)
        assert.equal(var_regexp(/hello/i), true)
        assert.deepEqual(get_value(var_regexp), true)
    })
    it(`date`, () => {
        assert.equal(get_value(var_date), false)
        assert.equal(var_date(date), true)
        assert.equal(get_value(var_date), true)
    })
    it(`null`, () => {
        assert.equal(get_value(var_null), false)
        assert.equal(var_null(null), true)
        assert.equal(get_value(var_null), true)
    })
    it(`symbol`, () => {
        assert.equal(get_value(var_symbol), false)
        assert.equal(var_symbol(Symbol.for('var_symbol')), true)
        assert.equal(get_value(var_symbol), true)
    })
    it(`undefined`, () => {
        assert.equal(get_value(var_undefined), false)
        assert.equal(var_undefined(undefined), true)
        assert.equal(get_value(var_undefined), true)
    })
})
describe(`Variable should match number only`, () => {
    it(`1`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(1), true)
    })
    it(`Infinity`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(Infinity), true)
    })
    it(`NaN`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(NaN), true)
    })
    it(`true`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(true), false)
    })
    it(`false`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(false), false)
    })
    it(`{}`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v({}), false)
    })
    it(`[]`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v([]), false)
    })
    it(`string`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v('string'), false)
    })
    it(`bigint`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(BigInt(1)), false)
    })
    it(`regexp`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(/hello/i), false)
    })
    it(`date`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(new Date()), false)
    })
    it(`null`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(null), false)
    })
    it(`symbol`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(Symbol.for('var_symbol')), false)
    })
    it(`undefined`, () => {
        let v = variable((x) => typeof x === 'number')
        assert.equal(v(undefined), false)
    })
})
describe(`Variable should match string only`, () => {
    it(`1`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(1), false)
    })
    it(`Infinity`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(Infinity), false)
    })
    it(`NaN`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(NaN), false)
    })
    it(`true`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(true), false)
    })
    it(`false`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(false), false)
    })
    it(`{}`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v({}), false)
    })
    it(`[]`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v([]), false)
    })
    it(`string`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v('string'), true)
    })
    it(`bigint`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(BigInt(1)), false)
    })
    it(`regexp`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(/hello/i), false)
    })
    it(`date`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(new Date()), false)
    })
    it(`null`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(null), false)
    })
    it(`symbol`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(Symbol.for('var_symbol')), false)
    })
    it(`undefined`, () => {
        let v = variable((x) => typeof x === 'string')
        assert.equal(v(undefined), false)
    })

})
describe(`Variable should match null only`, () => {
    it(`1`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(1), false)
    })
    it(`Infinity`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(Infinity), false)
    })
    it(`NaN`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(NaN), false)
    })
    it(`true`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(true), false)
    })
    it(`false`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(false), false)
    })
    it(`{}`, () => {
        let v = variable((x) => x === null)
        assert.equal(v({}), false)
    })
    it(`[]`, () => {
        let v = variable((x) => x === null)
        assert.equal(v([]), false)
    })
    it(`string`, () => {
        let v = variable((x) => x === null)
        assert.equal(v('string'), false)
    })
    it(`bigint`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(BigInt(1)), false)
    })
    it(`regexp`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(/hello/i), false)
    })
    it(`date`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(new Date()), false)
    })
    it(`null`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(null), true)
    })
    it(`symbol`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(Symbol.for('var_symbol')), false)
    })
    it(`undefined`, () => {
        let v = variable((x) => x === null)
        assert.equal(v(undefined), false)
    })

})
describe(`Variable should match boolean only`, () => {
    it(`1`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(1), false)
    })
    it(`Infinity`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(Infinity), false)
    })
    it(`NaN`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(NaN), false)
    })
    it(`true`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(true), true)
    })
    it(`false`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(false), true)
    })
    it(`{}`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v({}), false)
    })
    it(`[]`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v([]), false)
    })
    it(`string`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v('string'), false)
    })
    it(`bigint`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(BigInt(1)), false)
    })
    it(`regexp`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(/hello/i), false)
    })
    it(`date`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(new Date()), false)
    })
    it(`null`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(null), false)
    })
    it(`symbol`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(Symbol.for('var_symbol')), false)
    })
    it(`undefined`, () => {
        let v = variable((x) => typeof x === 'boolean')
        assert.equal(v(undefined), false)
    })

})
describe(`Variable should match nothing`, () => {
    it(`1`, () => {
        let v = variable((x) => false)
        assert.equal(v(1), false)
    })
    it(`Infinity`, () => {
        let v = variable((x) => false)
        assert.equal(v(Infinity), false)
    })
    it(`NaN`, () => {
        let v = variable((x) => false)
        assert.equal(v(NaN), false)
    })
    it(`true`, () => {
        let v = variable((x) => false)
        assert.equal(v(true), false)
    })
    it(`false`, () => {
        let v = variable((x) => false)
        assert.equal(v(false), false)
    })
    it(`{}`, () => {
        let v = variable((x) => false)
        assert.equal(v({}), false)
    })
    it(`[]`, () => {
        let v = variable((x) => false)
        assert.equal(v([]), false)
    })
    it(`string`, () => {
        let v = variable((x) => false)
        assert.equal(v('string'), false)
    })
    it(`bigint`, () => {
        let v = variable((x) => false)
        assert.equal(v(BigInt(1)), false)
    })
    it(`regexp`, () => {
        let v = variable((x) => false)
        assert.equal(v(/hello/i), false)
    })
    it(`date`, () => {
        let v = variable((x) => false)
        assert.equal(v(new Date()), false)
    })
    it(`null`, () => {
        let v = variable((x) => false)
        assert.equal(v(null), false)
    })
    it(`symbol`, () => {
        let v = variable((x) => false)
        assert.equal(v(Symbol.for('var_symbol')), false)
    })
    it(`undefined`, () => {
        let v = variable((x) => false)
        assert.equal(v(undefined), false)
    })

})

describe(`Environment`, () => {
    it(`should create Variable with the given matcher`, () => {
        let v1 = variable((x) => typeof x === 'boolean')
        let v2 = variable((x) => typeof x === 'number')
        assert.notEqual(v1, v2)
        assert.equal(v2(true), false)
        assert.equal(v2(1), true)
        assert.equal(v1(1), false)
        assert.equal(v1(true), true)
    })
})