export declare type Path = symbol | string | number | ((x: any) => any);
export declare enum PatternType {
    Generator = "Generator",
    Matcher = "Matcher"
}
export declare const patternArguments: unique symbol;
export declare const patternConstructor: unique symbol;
export declare const patternType: unique symbol;
