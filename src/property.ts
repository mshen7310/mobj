import { GeneratorFn } from "./gonad"

export function isWalkable(v: any): boolean {
    return typeof v === 'object'
        && v !== null
        && !(v instanceof Date)
        && !(v instanceof RegExp)
        && !(v instanceof Int8Array)
        && !(v instanceof Uint8Array)
        && !(v instanceof Uint8ClampedArray)
        && !(v instanceof Int16Array)
        && !(v instanceof Uint16Array)
        && !(v instanceof Int32Array)
        && !(v instanceof Uint32Array)
        && !(v instanceof Float32Array)
        && !(v instanceof Float64Array)
        && !(v instanceof DataView)
        && !(v instanceof ArrayBuffer)
        && !(v instanceof Buffer)
        && !(v instanceof ReadableStream)
        && !(v instanceof WritableStream)
        && !(v instanceof TransformStream)
        && !(v instanceof Promise)
}

export interface Property {
    value: any
    path: (symbol | number | string)[]
    root?: any
}

export function* from(arg?: any): Generator<Property> {
    switch (typeof arg) {
        case 'object': {
            if (arg instanceof Map) {
                for (let [k, v] of arg) {
                    yield { value: v, path: [k], root: arg }
                }
                break;
            } else if (arg instanceof Set) {
                for (let v of arg) {
                    yield { value: v, path: [], root: arg }
                }
                break;
            } else if (Array.isArray(arg)) {
                for (let i = 0; i < arg.length; ++i) {
                    yield { value: arg[i], path: [i], root: arg }
                }
                break;
            } else if (isWalkable(arg)) {
                for (let k of Reflect.ownKeys(arg)) {
                    yield { value: arg[k], path: [k], root: arg }
                }
                break;
            }
        }
        default: {
            yield { value: arg, path: [] }
        }
    }
}
export function walk(depth: number = 1): GeneratorFn<Property> {
    return function* (obj: any) {
        if (depth >= 1 && isWalkable(obj)) {
            let childWalker = walk(depth - 1)
            for (let property of from(obj)) {
                for (let child of childWalker(property.value)) {
                    yield { ...child, path: property.path.concat(child.path), root: obj }
                }
            }
        } else {
            yield { value: obj, path: [] }
        }
    }
}