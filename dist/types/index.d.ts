import { Path } from "../search";
export declare const SamplerSymbol: unique symbol;
export declare const MatcherSymbol: unique symbol;
export declare const DifferSymbol: unique symbol;
export interface Diff<T> {
    key: Path;
    type?: string;
    expect: T;
    got: any;
    message?: string;
}
export declare type Differ<T> = (data?: any) => IterableIterator<Diff<T>>;
export declare type Matcher = (data?: any) => boolean;
export declare type Sampler<T> = () => T;
export declare function isDiffer<T>(f: any): f is Differ<T>;
export declare function isMatcher(f: any): f is Matcher;
export declare function isSampler<T>(f: any): f is Sampler<T>;
export interface Type<T, P> {
    sampler(): Sampler<T>;
    matcher(): Matcher;
    differ(): Differ<P>;
    pattern(): P;
    factory(): (p: P) => Type<T, P>;
}
export interface TypeFactory<T, P> {
    new (pattern: P): Type<T, P>;
}
