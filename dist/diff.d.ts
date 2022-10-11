import { PassivePath } from "./search";
export declare type Difference = {
    path: PassivePath[];
    expected: any;
    actual: any;
};
export declare function match(a: any, b: any): Generator<never, void, unknown>;
