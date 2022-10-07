export declare type GeneratorFn<T = any> = (...arg: any[]) => Generator<T>;
export declare type PredicateFn<T = any> = (arg: T) => boolean;
export declare type TransformFn<T = any, R = any> = (arg: T) => R;
export declare type TranspredFn<T = any, R = any> = (arg: T) => [R];
export declare function isGenerator(fn: any): fn is Generator;
export declare function filter<T = any>(p: PredicateFn<T>): GeneratorFn<T>;
export declare function map<T = any, R = any>(t: TransformFn<T, R>): GeneratorFn<R>;
export declare function mapFilter<T = any, R = any>(fn: TranspredFn<T, R>): GeneratorFn<R>;
export declare function chain(...fn: GeneratorFn[]): GeneratorFn;
