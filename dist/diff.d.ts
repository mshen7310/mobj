import { Path } from "./path";
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
