import { StringPattern } from "."
export function matcher(pattern: StringPattern): (data: any) => boolean {
    if (typeof pattern === 'string') {
        return (data: any) => (typeof data === 'string') && (data === pattern)
    } else if (typeof pattern === 'number') {
        return (data: any) => (typeof data === 'string') && (data.length === pattern)
    } else if (pattern instanceof RegExp) {
        return (data: any) => {
            if (typeof data === 'string') {
                return pattern.test(data)
            } else if (data instanceof RegExp) {
                return data.source === pattern.source
            }
            return false;
        }
    } else if (Array.isArray(pattern)) {
        let checker = pattern.map(matcher)
        return (data: any) => {
            if (typeof data === 'string') {
                for (let i = 0; i < checker.length; ++i) {
                    if (checker[i](data)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    return () => false
}