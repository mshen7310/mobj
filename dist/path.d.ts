export declare type PropertyWalker = (value: any) => Generator<any[]>;
export declare type PathItem = string | number | symbol | PropertyWalker;
export declare type Path = PathItem[];
export declare type MapFilterFn = (value: any, key?: any, parent?: any) => [any, any, any] | undefined;
export declare function descendant(fn?: MapFilterFn, depth?: number | any): (value: any) => Generator<any[]>;
export declare function get(obj: any, ...path: Path): any;
export declare function path(...P: Path): any;
