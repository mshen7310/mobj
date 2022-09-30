import { descendant, identical, path } from '../src/path'
import 'mocha'
import { strict as assert } from 'node:assert';

const data = {
    hello: {
        world: 'hello world'
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
    }
}
describe('Path functions', () => {
    it('should return undefined', () => {
        const p = path(1).hello.world();
        assert.deepEqual(p(data), [])
    });
    it('should return "hello world"', () => {
        const p = path().hello.world();
        assert.deepEqual(p(data), [{ value: data.hello.world, path: ['hello', 'world'] }])
    })
    it('should return 4', () => {
        const p = path().work.kkk('hello', (value, key) => key === 'world' ? ({ a: 1, b: 2 }) : undefined).b(v => v * 2)()
        assert.deepEqual(p(data), [{ value: 4, path: ['work', 'kkk', 'hello', 'world', 'b'] }])
    })
});
describe('descendant **', () => {
    it('should return [{ k: "k1", z: "z1" }, { k: "k2", z: "z2" }]', () => {
        const p = path(descendant((value) => {
            if (typeof value === 'object' && 'k' in value && 'z' in value) {
                return value
            }
        }, Infinity))()
        assert.deepEqual(p(data), [{
            value: {
                k: 'k1', z: 'z1'
            },
            path: ['work', 'kkk', 'hello', 'world', 'd', 0]
        }, {
            value: {
                k: 'k2', z: 'z2'
            },
            path: ['work', 'kkk', 'hello', 'world', 'd', 1]
        }])
    })
    it('should return []', () => {
        const pp = path(descendant((value) => {
            if (typeof value === 'object' && 'k' in value && 'z' in value) {
                return value
            }
        }, 2))()
        assert.deepEqual(pp(data), [])
    })

});