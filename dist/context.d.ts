import { Matcher } from "./types";
export declare type Variable = (...value: any[]) => any;
export declare function variable(matcher?: Matcher): Variable;
export declare class Context {
    private readonly registry;
    var(name?: string | Matcher, matcher?: Matcher): Variable;
}
