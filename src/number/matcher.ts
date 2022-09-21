export function matcher(start: number | [number], end?: number): (data: any) => boolean {
    if (typeof start === 'number') {
        if (typeof end !== 'number') {
            return (data: any) => (typeof data === 'number') && (data === start)
        } else {
            let max = Math.max(start, end)
            let min = Math.min(start, end)
            return (data: any) => (typeof data === 'number') && (data >= min && data <= max)
        }
    } else if (Array.isArray(start)) {
        return (data: any) => (typeof data === 'number') && (start.find(x => x === data) !== undefined)
    }
    throw Error(`Expect number | [number], got ${start}: ${typeof start}`)
}

