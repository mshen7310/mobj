export interface Variable {
    path?: Exclude<PathItem, Walker>[];
    value?: any;
    root?: object;
}
export declare type Walker = (value: any) => Generator<Variable>;
export declare type PathItem = string | number | symbol | Walker;
export declare type Path = PathItem[];
export declare type MapFilterFn = (value: any, key?: Exclude<PathItem, Walker>, parent?: any) => any;
export declare function descendant(fn?: MapFilterFn, depth?: number | any): (a: any) => Generator<Variable>;
export declare function get(obj: any, ...path: Path): Generator<Variable>;
export declare function path(...P: Path): any;
