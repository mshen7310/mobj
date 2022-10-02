export declare type GeneratorFn<T> = (...arg: any[]) => Generator<T>;
export declare type PredicateFn<T> = (arg: T) => boolean;
export declare type TransformFn<T, R> = (arg: T) => R;
export declare function filter<T>(p: PredicateFn<T>): GeneratorFn<T>;
export declare function map<T, R>(t: TransformFn<T, R>): Generator<R>;
