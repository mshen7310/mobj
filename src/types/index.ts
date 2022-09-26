

export const GeneratorSymbol: unique symbol = Symbol.for('alpacar.Generator')
export const MatcherSymbol: unique symbol = Symbol.for('alpacar.Matcher')

export type Matcher = (data?: any) => boolean;
export type Generator<T> = () => T


export function isMatcher(f: any): f is Matcher {
    return typeof f === 'function' && f[MatcherSymbol] === true
}
export function isGenerator<T>(f: any): f is Generator<T> {
    return typeof f === 'function' && f[GeneratorSymbol] === true
}

export interface Type<T, P> {
    generator(): Generator<T>
    matcher(): Matcher
    pattern(): P
    factory(): (p: P) => Type<T, P>
}
export interface TypeFactory<T, P> {
    new(pattern: P): Type<T, P>
}
