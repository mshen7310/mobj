import { StringPattern } from "."
import { intOf } from "../random"
const RandExp = require("randexp/types")
// string | number | RegExp | StringPattern[]
export function generator(pattern: StringPattern): () => string {
    if ((typeof pattern === 'string') || (pattern instanceof RegExp)) {
        let pt = new RandExp(pattern)
        return () => pt.gen()
    } else if (typeof pattern === 'number') {
        let len = pattern;
        return () => Array.from(
            { length: len },
            () => String.fromCharCode(Math.floor(Math.random() * (65536)))
        ).join('')
    } else if (Array.isArray(pattern)) {
        let len = pattern.length
        return () => {
            pattern = pattern[intOf(len)]
            let gen = generator(pattern)
            return gen()
        }
    }
    throw Error(`Expect string | number | RegExp | StringPattern[], got ${pattern}: ${typeof pattern}`)
}