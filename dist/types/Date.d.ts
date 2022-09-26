import { Type } from ".";
export interface DateSpec {
    locale?: Locale;
    week?: number;
    year?: number;
    month?: number;
    date?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}
export declare type DateRange = [Date, Date];
export declare type DatePattern = DateSpec | Date | DateRange | DateRange[] | Date[];
export declare function isDateSpec(data: any): data is DateSpec;
export declare function isDate(data: any): data is Date;
export declare function isDateRange(data: any): data is DateRange;
export declare function isDateRangeArray(data: any): data is DateRange[];
export declare function isDateArray(data: any): data is Date[];
export declare function isDatePattern(data: any): data is DatePattern;
export default function makeDate(pattern: DatePattern): Type<Date, DatePattern>;
