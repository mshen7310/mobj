import { Predicate } from "./diff";
export declare function match(pattern: any): Predicate;
export declare function not(pattern: any): Predicate;
export declare function and(...pattern: any[]): Predicate;
export declare function or(...pattern: any[]): Predicate;
