import { Path } from "../property";


export const SamplerSymbol: unique symbol = Symbol.for('alpacar.Sampler')
export const MatcherSymbol: unique symbol = Symbol.for('alpacar.Matcher')
export const DifferSymbol: unique symbol = Symbol.for('alpacar.Differ')


export interface Diff<T> {
    key: Path
    type?: string
    expect: T
    got: any
    message?: string
}
export type Differ<T> = (data?: any) => IterableIterator<Diff<T>>
export type Matcher = (data?: any) => boolean;
export type Sampler<T> = () => T

export function isDiffer<T>(f: any): f is Differ<T> {
    return typeof f === 'function' && f[DifferSymbol] === true
}
export function isMatcher(f: any): f is Matcher {
    return typeof f === 'function' && f[MatcherSymbol] === true
}
export function isSampler<T>(f: any): f is Sampler<T> {
    return typeof f === 'function' && f[SamplerSymbol] === true
}

export interface Type<T, P> {
    sampler(): Sampler<T>
    matcher(): Matcher
    differ(): Differ<P>
    pattern(): P
    factory(): (p: P) => Type<T, P>
}
export interface TypeFactory<T, P> {
    new(pattern: P): Type<T, P>
}
