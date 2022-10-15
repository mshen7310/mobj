import { DoneFn, Path } from "./children";
import { equalSetElement } from "./deepEqual";
export declare function search(fn: (a: any, path: Path[], done: DoneFn) => any, depth?: number): (...args: any[]) => Generator;
export declare function path(set_getter?: typeof equalSetElement): any;
