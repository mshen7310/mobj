import { Path } from "./search";
import { Matcher } from "./types";
export declare function deepEqual(x: any, y: any): boolean;
export declare type Variable = <T>(...value: T[]) => boolean;
export declare function variable(matcher?: Matcher): Variable;
export declare class Context {
    private readonly skip_node;
    private readonly registry;
    private readonly path;
    private readonly node;
    skip(a: any): void;
    cancel(): void;
    skipped(a: any): boolean;
    push(node: any, p: Path): Path;
    pop(): Path;
    getPath(): Path[];
    accessor(n?: number): (x: any) => any;
    var(name?: string | Matcher, matcher?: Matcher): Variable;
}
