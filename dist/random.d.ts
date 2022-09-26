export declare function seed(s?: string | number, alg?: 0 | 1 | 2 | 3): () => number;
export declare function anyOf(...arg: any): any;
export declare function bigintOf(start: bigint, end?: bigint): bigint;
export declare function intOf(start: number, end?: number): number;
export declare function elementOf(array: any[]): any;
export declare function numberOf(start: number, end?: number): number;
export declare function initRandomSeed(x?: string | number, alg?: 0 | 1 | 2 | 3): void;
