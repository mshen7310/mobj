import { getWeek, isSameMonth, nextDay, set } from 'date-fns'
import { getDaysInMonth } from 'date-fns/fp'
import { startOfWeek } from 'date-fns'
import { DatetimePattern } from "."
import { intOf } from '../random'
export function generator(pattern: DatetimePattern): () => Date {
    if (pattern instanceof Date) {
        return () => pattern
    } else if (Array.isArray(pattern)) {
        return () => {
            let [start, end] = pattern
            return new Date(intOf(start.getTime(), end.getTime()))
        }
    }
    else {
        let { week, year, month, date, hours, minutes, seconds, milliseconds } = pattern
        return () => {
            let ret = new Date();
            if (typeof hours === 'number') {
                ret = set(ret, { hours })
            } else {
                ret = set(ret, { hours: intOf(0, 23) })
            }
            if (typeof minutes === 'number') {
                ret = set(ret, { minutes })
            } else {
                ret = set(ret, { minutes: intOf(0, 59) })
            }
            if (typeof seconds === 'number') {
                ret = set(ret, { seconds })
            } else {
                ret = set(ret, { seconds: intOf(0, 59) })
            }
            if (typeof milliseconds === 'number') {
                ret = set(ret, { milliseconds })
            } else {
                ret = set(ret, { milliseconds: intOf(0, 999) })
            }
            if (typeof year === 'number') {
                ret = set(ret, { year })
            } else {
                ret = set(ret, { year: intOf(1980, 2300) })
            }
            if (typeof month === 'number') {
                ret = set(ret, { month: month - 1 })
            } else {
                ret = set(ret, { month: intOf(0, 11) })
            }
            if (typeof date === 'number') {
                ret = set(ret, { date })
                return ret;
            } else if (typeof week === 'number') {
                week = week - 1;
                ret = set(ret, { date: intOf(1, getDaysInMonth(ret)) })
                if (getWeek(ret) !== week) {
                    let start = startOfWeek(ret, { weekStartsOn: week as Day })
                    if (!isSameMonth(start, ret)) {
                        return nextDay(ret, week as Day)
                    }
                }
            } else {
                ret = set(ret, { date: intOf(1, getDaysInMonth(ret)) })
            }
            return ret;
        }
    }
}