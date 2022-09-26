import { Path } from ".";
export declare enum FieldType {
    Struct = "Struct",
    Array = "Array",
    Replace = "Replace"
}
export declare type Diff = {
    key?: Path[];
    type: FieldType;
    delta: {
        pattern?: any;
        data?: any;
    } | Diff[];
    comment?: any;
};
export declare function diff(pattern?: any, data?: any, key?: Path): Diff | undefined;
