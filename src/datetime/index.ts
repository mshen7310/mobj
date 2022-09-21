export { generator } from './generator'
export { matcher } from './matcher'

export interface DatetimeSpec {
    week?: number
    year?: number
    month?: number
    date?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
}

export type DatetimePattern = DatetimeSpec | Date | [Date, Date]