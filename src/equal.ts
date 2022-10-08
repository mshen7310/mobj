export const sameValueZero = (x, y) => x === y || (Number.isNaN(x) && Number.isNaN(y));
export function deepEqual(x, y, skip = new WeakMap()): boolean {
    if (sameValueZero(x, y)) {
        return true;
    }
    if (typeof x !== typeof y || typeof x !== 'object') {
        return false;
    }
    if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime()
    } else if (x instanceof RegExp && y instanceof RegExp) {
        return x.toString() === y.toString()
    }
    if (skip.has(x)) {
        return skip.get(x) === y
    }
    if (x instanceof Map && y instanceof Map) {
        if (x.size === y.size) {
            for (let [k, v] of x) {
                if (!y.has(k) || !deepEqual(v, y.get(k), skip)) {
                    skip.set(x, false)
                    return false
                }
            }
            skip.set(x, y)
            return true
        } else {
            skip.set(x, false)
            return false
        }
    } else if (Array.isArray(x) && Array.isArray(y)) {
        if (x.length === y.length) {
            for (let i = 0; i < x.length; ++i) {
                if (!deepEqual(x[i], y[i], skip)) {
                    skip.set(x, false)
                    return false
                }
            }
            skip.set(x, y)
            return true
        } else {
            skip.set(x, false)
            return false
        }
    } else if (x instanceof Set && y instanceof Set) {
        if (x.size === y.size) {
            let x_array = [...x]
            let y_array = [...y]
            for (let i = 0; i < x_array.length; ++i) {
                if (!deepEqual(x_array[i], y_array[i], skip)) {
                    skip.set(x, false)
                    return false
                }
            }
            skip.set(x, y)
            return true
        } else {
            skip.set(x, false)
            return false
        }
    } else {
        let x_keys = Reflect.ownKeys(x)
        let y_keys = Reflect.ownKeys(y)
        if (x_keys.length === y_keys.length) {
            for (let k of x_keys) {
                if (!deepEqual(x[k], y[k], skip)) {
                    skip.set(x, false)
                    return false
                }
            }
            skip.set(x, y)
            return true
        } else {
            skip.set(x, false)
            return false
        }
    }
}
