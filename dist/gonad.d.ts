export declare class Context {
    private readonly skip_node;
    private readonly node;
    skip(...a: any[]): void;
    skipped(a: any): boolean;
    push(node: any): number;
    pop(): any;
}
export declare type Element = readonly [
    done: (...obj: any[]) => void,
    path: Path[],
    value?: any
];
export declare type SetKey = readonly [number, symbol];
export declare type MapKey = readonly [any, symbol];
export declare type Path = symbol | number | string | SetKey | MapKey;
export declare function isMapKey(p: any): p is MapKey;
export declare function mapKey(k: any): MapKey;
export declare function isSetKey(p: any): p is SetKey;
export declare function setKey(index: number): SetKey;
export declare function isPath(p: any): p is Path;
declare type GenFn<T, R> = (...input: T[]) => IterableIterator<R>;
declare type GenChild = GenFn<any, readonly [Path, any, boolean?]>;
export declare function iterators(...args: (GenChild | readonly [any, GenChild])[]): (...objs: any[]) => Generator<readonly [Path, any, boolean?], void, undefined>;
export declare function children(depth?: number, ite?: (...objs: any[]) => Generator<readonly [Path, any, boolean?], void, undefined>): (...objects: any[]) => IterableIterator<Element>;
export {};
