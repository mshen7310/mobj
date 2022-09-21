
import { getHours, getMinutes, getSeconds, getDay, getDate, getMonth, getYear, getMilliseconds, isAfter, isBefore } from "date-fns/fp"
import { DatetimePattern } from '.'

// DatetimeSpec | Date | [Date, Date]
export function matcher(pattern: DatetimePattern): (datetime: any) => boolean {
    if (pattern instanceof Date) {
        return (datetime: any) => (datetime instanceof Date) && datetime.getTime() === pattern.getTime()
    } else if (Array.isArray(pattern)) {
        let [start, end] = pattern
        if (isAfter(end, start)) {
            return (datetime: any) => (datetime instanceof Date) && isAfter(datetime, start) && isBefore(datetime, end)
        } else {
            return (datetime: any) => (datetime instanceof Date) && isAfter(datetime, end) && isBefore(datetime, start)
        }
    } else {
        return (datetime: any) => {
            if (datetime instanceof Date) {
                let year: boolean = (typeof pattern.year !== 'number' || getYear(datetime) === pattern.year)
                let month: boolean = (typeof pattern.month !== 'number' || getMonth(datetime) + 1 === pattern.month)
                let date: boolean = (typeof pattern.date !== 'number' || getDate(datetime) === pattern.date)
                let week: boolean = (typeof pattern.week !== 'number' || getDay(datetime) + 1 === pattern.week)
                let hour: boolean = (typeof pattern.hours !== 'number' || getHours(datetime) === pattern.hours)
                let minute: boolean = (typeof pattern.minutes !== 'number' || getMinutes(datetime) === pattern.minutes)
                let second: boolean = (typeof pattern.seconds !== 'number' || getSeconds(datetime) === pattern.seconds)
                let milliseconds: boolean = (typeof pattern.milliseconds !== 'number' || getMilliseconds(datetime) === pattern.milliseconds)
                let ret = year && month && date && week && hour && minute && second && milliseconds
                return ret;
            }
            return false;
        }
    }
}

