export function match(pattern: RegExp): (data: string) => boolean {
    return (data: string) => pattern.test(data)
}