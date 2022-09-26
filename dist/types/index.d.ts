export declare const GeneratorSymbol: unique symbol;
export declare const MatcherSymbol: unique symbol;
export declare type PathItem = string | number | symbol;
export declare function PathBuilder(): () => any;
export declare type Diff = undefined | {} | Diff[];
export declare type Matcher = (data?: any) => boolean;
export declare type Generator<T> = () => T;
export declare function isMatcher(f: any): f is Matcher;
export declare function isGenerator<T>(f: any): f is Generator<T>;
export interface Type<T, P> {
    generator(): Generator<T>;
    matcher(): Matcher;
    pattern(): P;
    factory(): (p: P) => Type<T, P>;
}
export interface TypeFactory<T, P> {
    new (pattern: P): Type<T, P>;
}
