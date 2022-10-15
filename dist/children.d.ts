export declare function isGenerator(fn: any): fn is Generator;
export declare function fromGeneratorFn(x: any): boolean;
export declare type DoneFn = (...obj: any[]) => void;
export declare type Element<P extends Path, V = any> = readonly [
    done: DoneFn,
    path: P[],
    value: V
];
export declare type SetKey<T> = readonly [T, 'SetKey'];
export declare type MapKey<T> = readonly [T, 'MapKey'];
export declare type Path = symbol | number | string | SetKey<any> | MapKey<any>;
export declare function isMapKey(p: any): p is MapKey<any>;
export declare function mapKey<T>(k: T): MapKey<T>;
export declare function isSetKey(p: any): p is SetKey<any>;
export declare function setKey<T>(v: T): SetKey<T>;
export declare function isPath(p: any): p is Path;
declare type GenFn<T extends any[], R> = (...input: T) => Generator<R>;
declare type KeyOf<T> = T extends Map<infer K, infer _> ? [K, 'MapKey'] : T extends Set<infer S> ? [S, 'SetKey'] : T extends Array<infer _> ? number : T extends Object ? string | symbol : never;
declare type ValueOfMap<Key, V> = Key extends MapKey<Key> ? V : never;
declare type ValueOfSet<Key, V> = Key extends SetKey<V> ? V : never;
declare type ValueOfArray<Key, V> = Key extends number ? V : never;
declare type ValueOfObject<Key, T> = Key extends keyof T ? T[Key] : never;
declare type ValueOf<T extends object, Key extends Path> = T extends Map<infer _, infer V> ? ValueOfMap<Key, V> : T extends Set<infer V> ? ValueOfSet<Key, V> : T extends Array<infer V> ? ValueOfArray<Key, V> : ValueOfObject<Key, T>;
declare type GenChild<T = any> = GenFn<T[], readonly [KeyOf<T>, any, boolean?]>;
declare type GetResult<T extends object, P extends Path> = T | ValueOf<T, P>;
export declare type SetGetter<T = any, R = any> = (e: T, set: Set<T>) => readonly [R?];
export declare function getter<PP extends Path[], T extends object>(set_getter: SetGetter | null, ...path: PP): (obj: T) => readonly [GetResult<T, PP[0]>?];
export declare function iterators(...args: (GenChild | readonly [any, GenChild])[]): (...objs: any[]) => Generator<any, void, any>;
export declare type ElementGenerator<T extends any[], V = any> = (...objects: T) => Generator<Element<Path, V>>;
export declare function children(depth?: number, ite?: (...objs: any[]) => Generator<any, void, any>): ElementGenerator<any>;
export {};
