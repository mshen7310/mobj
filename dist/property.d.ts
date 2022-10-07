export declare function isWalkable(v: any): boolean;
export interface Property {
    value: any;
    path: Exclude<Path, Walker>[];
    root?: any;
}
export declare type Walker = (value?: any) => Generator<Property>;
export declare type Path = symbol | number | string | Walker;
export declare function from(arg?: any): Generator<Property>;
export declare function children(): Walker;
export declare function search(): Walker;
export declare type ActionFn = (root: any, ...rest: Path[]) => any;
export declare function path(act?: ActionFn): any;
