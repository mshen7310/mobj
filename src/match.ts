import { discriminator, Predicate } from "./discriminator"

export function match(pattern): Predicate {
    let fn = discriminator(pattern)
    return function <T>(...data: T[]): boolean {
        for (let _ of fn(...data)) {
            return false
        }
        return true
    }
}
export function not(pattern): Predicate {
    let fn = match(pattern)
    return function <T>(...data: T[]): boolean {
        return !fn(...data)
    }
}
export function and(...pattern: any[]): Predicate {
    let fns = pattern.map(match)
    return function <T>(...data: T[]): boolean {
        for (let fn of fns) {
            if (!fn(...data)) {
                return false
            }
        }
        return true
    }
}
export function or(...pattern: any[]): Predicate {
    let fns = pattern.map(match)
    return function <T>(...data: T[]): boolean {
        for (let fn of fns) {
            if (fn(...data)) {
                return true
            }
        }
        return false
    }
}