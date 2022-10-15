import { DoneFn, Path } from "./children";
declare type PathComponent = Path | ((obj: any) => any);
export declare function search(fn: (a: any, path: Path[], done: DoneFn) => any, depth?: number): (...args: any[]) => Generator;
export declare function path(...all_path: PathComponent[]): any;
export {};
