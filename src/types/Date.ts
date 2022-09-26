import { getDate, getDay, getDaysInMonth, getHours, getMilliseconds, getMinutes, getMonth, getSeconds, getWeek, getYear, isAfter, isBefore, isSameMonth } from "date-fns/fp"
import { set, startOfWeek, nextDay, setDefaultOptions } from 'date-fns'
import { Sampler, SamplerSymbol, Matcher, MatcherSymbol, Type, Diff, Differ, DifferSymbol } from "."
import { elementOf, intOf } from "../random"
import { es, zhCN, } from 'date-fns/locale'

export interface DateSpec {
    locale?: Locale
    week?: number
    year?: number
    month?: number
    date?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number

}
export type DateRange = [Date, Date]
export type DatePattern = DateSpec | Date | DateRange | DateRange[] | Date[]

export function isDateSpec(data: any): data is DateSpec {
    let keyofDatetimeSpec: (keyof DateSpec)[] = ['week', 'year', 'month', 'date', 'hours', 'minutes', 'seconds', 'milliseconds', 'locale']
    return typeof data === 'object' && data !== null && keyofDatetimeSpec.reduce((a: boolean, c: string) => a || c in data, false)
}

export function isDate(data: any): data is Date {
    return data instanceof Date
}

export function isDateRange(data: any): data is DateRange {
    return Array.isArray(data) && data.length === 2 && data[0] instanceof Date && data[1] instanceof Date && isAfter(data[1], data[0])
}

export function isDateRangeArray(data: any): data is DateRange[] {
    return Array.isArray(data) && data.filter(x => !isDateRange(x)).length === 0
}

export function isDateArray(data: any): data is Date[] {
    return Array.isArray(data) && data.filter(x => !isDate(x)).length === 0
}
export function isDatePattern(data: any): data is DatePattern {
    return isDate(data)
        || isDateRange(data)
        || isDateRangeArray(data)
        || isDateArray(data)
        || isDateSpec(data)
}
class DateClass implements Type<Date, DatePattern>{
    constructor(private ptn: DatePattern) {
        if (!isDatePattern(ptn)) {
            throw Error(`Expect Date | Date[] | [Date, Date] | [Date, Date][] | DateSpec, got ${ptn}: ${typeof ptn}`)
        }
    }
    pattern(): DatePattern {
        return this.ptn
    }
    factory(): (p: DatePattern) => Type<Date, DatePattern> {
        return makeDate;
    }
    sampler(): Sampler<Date> {
        let self = this;
        let ret: () => Date;
        if (isDate(self.ptn)) {
            ret = () => self.ptn as Date
        } else if (isDateRange(self.ptn)) {
            ret = () => {
                let [start, end] = self.ptn as [Date, Date]
                return new Date(intOf(start.getTime(), end.getTime()))
            }
        } else if (isDateArray(self.ptn)) {
            ret = () => elementOf(self.ptn as Date[])
        } else if (isDateRangeArray(self.ptn)) {
            ret = () => {
                let [start, end] = elementOf(self.ptn as DateRange[])
                return new Date(intOf(start.getTime(), end.getTime()))
            }
        } else if (isDateSpec(self.ptn)) {
            let { week, year, month, date, hours, minutes, seconds, milliseconds, locale } = self.ptn as DateSpec
            ret = () => {
                if (locale) {
                    setDefaultOptions({ locale })
                }
                let spec = new Date()
                spec = typeof year === 'number' ? set(spec, { year }) : set(spec, { year: intOf(1970, 275759) })
                spec = typeof month === 'number' ? set(spec, { month: month - 1 }) : set(spec, { month: intOf(0, 11) })
                spec = typeof hours === 'number' ? set(spec, { hours }) : set(spec, { hours: intOf(0, 23) })
                spec = typeof minutes === 'number' ? set(spec, { minutes }) : set(spec, { minutes: intOf(0, 59) })
                spec = typeof seconds === 'number' ? set(spec, { seconds }) : set(spec, { seconds: intOf(0, 59) })
                spec = typeof milliseconds === 'number' ? set(spec, { milliseconds }) : set(spec, { milliseconds: intOf(0, 999) })
                spec = typeof date === 'number' ? set(spec, { date }) : set(spec, { date: intOf(1, getDaysInMonth(spec)) })
                if (typeof week === 'number') {
                    week = week - 1;
                    if (getWeek(spec) !== week) {
                        let start = startOfWeek(spec, { weekStartsOn: week as Day })
                        if (!isSameMonth(start, spec)) {
                            return nextDay(spec, week as Day)
                        }
                    }
                }
                return spec;
            }
        }
        ret[SamplerSymbol] = true
        return ret;
    }
    differ(): Differ<DatePattern> {
        let self = this
        let ret: (data: any) => IterableIterator<Diff<DatePattern>>
        if (isDate(self.ptn)) {
            function* retf(data: any) {
                if (!(data instanceof Date) || data.getTime() !== (self.ptn as Date).getTime()) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else if (isDateRange(self.ptn)) {
            let [start, end] = self.ptn
            function* retf(data: any) {
                if (!(data instanceof Date) || isAfter(start, data) || isBefore(end, data)) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else if (isDateArray(self.ptn)) {
            function* retf(data: any) {
                if (!(data instanceof Date) || (self.ptn as Date[]).find(x => x.getTime() === data.getTime()) === undefined) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    }
                }
            }
            ret = retf
        } else if (isDateRangeArray(self.ptn)) {
            function* retf(data: any) {
                if (data instanceof Date) {
                    let ptn: DateRange[] = self.ptn as DateRange[]
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i]
                        if (isAfter(data, start) && isBefore(data, end)) {
                            return
                        }
                    }
                }
                return {
                    key: [],
                    expect: self.ptn,
                    got: data
                }
            }
            ret = retf
        } else if (isDateSpec(self.ptn)) {
            let spec: DateSpec = self.ptn
            function* retf(data: any) {
                if (data instanceof Date) {
                    let year: boolean = (typeof spec.year !== 'number' || getYear(data) === spec.year)
                    let month: boolean = (typeof spec.month !== 'number' || getMonth(data) + 1 === spec.month)
                    let date: boolean = (typeof spec.date !== 'number' || getDate(data) === spec.date)
                    let week: boolean = (typeof spec.week !== 'number' || getDay(data) + 1 === spec.week)
                    let hour: boolean = (typeof spec.hours !== 'number' || getHours(data) === spec.hours)
                    let minute: boolean = (typeof spec.minutes !== 'number' || getMinutes(data) === spec.minutes)
                    let second: boolean = (typeof spec.seconds !== 'number' || getSeconds(data) === spec.seconds)
                    let milliseconds: boolean = (typeof spec.milliseconds !== 'number' || getMilliseconds(data) === spec.milliseconds)
                    if (year && month && date && week && hour && minute && second && milliseconds) {
                        return
                    }
                }
                return {
                    key: [],
                    expect: self.ptn,
                    got: data
                }
            }
            ret = retf
        }
        ret[DifferSymbol] = true;
        return ret

    }
    matcher(): Matcher {
        let self = this;
        let ret: (data: any) => boolean
        if (isDate(self.ptn)) {
            ret = (datetime: any) => (datetime instanceof Date) && datetime.getTime() === (self.ptn as Date).getTime()
        } else if (isDateRange(self.ptn)) {
            let [start, end] = self.ptn
            ret = (datetime: any) => (datetime instanceof Date) && isAfter(datetime, start) && isBefore(datetime, end)
        } else if (isDateArray(self.ptn)) {
            ret = (datetime: any) => (datetime instanceof Date) && (self.ptn as Date[]).find(x => x.getTime() === datetime.getTime()) !== undefined
        } else if (isDateRangeArray(self.ptn)) {
            ret = (datetime: any) => {
                if (datetime instanceof Date) {
                    let ptn: DateRange[] = self.ptn as DateRange[]
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i]
                        if (isAfter(datetime, start) && isBefore(datetime, end)) {
                            return true
                        }
                    }
                }
                return false;
            }
        } else if (isDateSpec(self.ptn)) {
            let spec: DateSpec = self.ptn
            ret = (datetime: any) => {
                if (datetime instanceof Date) {
                    let year: boolean = (typeof spec.year !== 'number' || getYear(datetime) === spec.year)
                    let month: boolean = (typeof spec.month !== 'number' || getMonth(datetime) + 1 === spec.month)
                    let date: boolean = (typeof spec.date !== 'number' || getDate(datetime) === spec.date)
                    let week: boolean = (typeof spec.week !== 'number' || getDay(datetime) + 1 === spec.week)
                    let hour: boolean = (typeof spec.hours !== 'number' || getHours(datetime) === spec.hours)
                    let minute: boolean = (typeof spec.minutes !== 'number' || getMinutes(datetime) === spec.minutes)
                    let second: boolean = (typeof spec.seconds !== 'number' || getSeconds(datetime) === spec.seconds)
                    let milliseconds: boolean = (typeof spec.milliseconds !== 'number' || getMilliseconds(datetime) === spec.milliseconds)
                    return year && month && date && week && hour && minute && second && milliseconds
                }
                return false;
            }
        }
        ret[MatcherSymbol] = true;
        return ret
    }
}

export default function makeDate(pattern: DatePattern): Type<Date, DatePattern> {
    return new DateClass(pattern)
}