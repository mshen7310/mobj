import { intOf, numberOf } from "../random"

// start: number | [number], end?: number
export function generator(start: number | [number], end?: number): () => number {
    if (typeof start === 'number') {
        if (typeof end === 'number') {
            let max = Math.max(start, end)
            let min = Math.min(start, end)
            if (max === Math.floor(max) && min === Math.ceil(min)) {
                return () => intOf(min, max)
            }
            return () => numberOf(min, max)
        } else {
            return () => start
        }
    } else if (Array.isArray(start)) {
        return () => start[intOf(start.length - 1)]
    }
    throw Error(`Expect number | [number], got ${start}: ${typeof start}`)
}
