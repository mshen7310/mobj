export type Generator<T, R = T> = (pattern: T) => (arg?: any) => R

