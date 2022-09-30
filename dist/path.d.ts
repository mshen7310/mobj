export interface Variable {
    path?: Exclude<PathItem, Walker>[];
    value?: any;
    root?: object;
}
export declare type Walker = (value: any) => Generator<Variable>;
export declare type PathItem = string | number | symbol | Walker | MapFilter;
export declare type Path = PathItem[];
export declare type MapFilterResult = void | [any];
export declare type MapFilter = (value: any, key?: string | number | symbol, parent?: object) => MapFilterResult;
export declare function identical(value: any): [any];
export declare function descendant(fn?: MapFilter, depth?: number): (a: any) => Generator<Variable>;
export declare function path(...P: Path): any;
