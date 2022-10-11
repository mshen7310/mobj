export declare function isGenerator(fn: any): fn is Generator;
export declare class Context {
    private readonly skip_node;
    private readonly path;
    private readonly node;
    skip(a: any): void;
    cancel(): void;
    skipped(a: any): boolean;
    push(node: any, p: Path): Path;
    pop(): Path;
    getPath(): Path[];
    getPassivePath(): PassivePath[];
    accessor(n?: number): (x: any) => any;
}
export declare type Walkable = object;
export declare function isWalkable(v: any): v is Walkable;
export declare type SetKey = readonly [number, symbol];
export declare type Path = symbol | number | string | SetKey | WalkerFn;
export declare type PassivePath = Exclude<Path, WalkerFn>;
export declare type Property = any;
export declare type WalkerFn = (value: any, ctx: Context) => Property;
export declare type Walker = (value: any, ctx: Context) => Generator<Property>;
export declare function setKey(index: number): SetKey;
export declare function asGenerator(result: any): Generator<any, void, any>;
export declare function isPassivePath(p: any): p is Exclude<Path, WalkerFn>;
export declare function fromGeneratorFn(x: any): boolean;
export declare type ActionFn = (root: any, ...rest: Path[]) => any;
export declare function search(fn: WalkerFn, depth?: number): Walker;
export declare function path(act?: ActionFn, all_path?: Path[]): any;
