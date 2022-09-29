"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatePattern = exports.isDateArray = exports.isDateRangeArray = exports.isDateRange = exports.isDate = exports.isDateSpec = void 0;
const fp_1 = require("date-fns/fp");
const date_fns_1 = require("date-fns");
const _1 = require(".");
const random_1 = require("../random");
function isDateSpec(data) {
    let keyofDatetimeSpec = ['week', 'year', 'month', 'date', 'hours', 'minutes', 'seconds', 'milliseconds', 'locale'];
    return typeof data === 'object' && data !== null && keyofDatetimeSpec.reduce((a, c) => a || c in data, false);
}
exports.isDateSpec = isDateSpec;
function isDate(data) {
    return data instanceof Date;
}
exports.isDate = isDate;
function isDateRange(data) {
    return Array.isArray(data) && data.length === 2 && data[0] instanceof Date && data[1] instanceof Date && (0, fp_1.isAfter)(data[1], data[0]);
}
exports.isDateRange = isDateRange;
function isDateRangeArray(data) {
    return Array.isArray(data) && data.filter(x => !isDateRange(x)).length === 0;
}
exports.isDateRangeArray = isDateRangeArray;
function isDateArray(data) {
    return Array.isArray(data) && data.filter(x => !isDate(x)).length === 0;
}
exports.isDateArray = isDateArray;
function isDatePattern(data) {
    return isDate(data)
        || isDateRange(data)
        || isDateRangeArray(data)
        || isDateArray(data)
        || isDateSpec(data);
}
exports.isDatePattern = isDatePattern;
class DateClass {
    constructor(ptn) {
        this.ptn = ptn;
        if (!isDatePattern(ptn)) {
            throw Error(`Expect Date | Date[] | [Date, Date] | [Date, Date][] | DateSpec, got ${ptn}: ${typeof ptn}`);
        }
    }
    pattern() {
        return this.ptn;
    }
    factory() {
        return makeDate;
    }
    sampler() {
        let self = this;
        let ret;
        if (isDate(self.ptn)) {
            ret = () => self.ptn;
        }
        else if (isDateRange(self.ptn)) {
            ret = () => {
                let [start, end] = self.ptn;
                return new Date((0, random_1.intOf)(start.getTime(), end.getTime()));
            };
        }
        else if (isDateArray(self.ptn)) {
            ret = () => (0, random_1.elementOf)(self.ptn);
        }
        else if (isDateRangeArray(self.ptn)) {
            ret = () => {
                let [start, end] = (0, random_1.elementOf)(self.ptn);
                return new Date((0, random_1.intOf)(start.getTime(), end.getTime()));
            };
        }
        else if (isDateSpec(self.ptn)) {
            let { week, year, month, date, hours, minutes, seconds, milliseconds, locale } = self.ptn;
            ret = () => {
                if (locale) {
                    (0, date_fns_1.setDefaultOptions)({ locale });
                }
                let spec = new Date();
                spec = typeof year === 'number' ? (0, date_fns_1.set)(spec, { year }) : (0, date_fns_1.set)(spec, { year: (0, random_1.intOf)(1970, 275759) });
                spec = typeof month === 'number' ? (0, date_fns_1.set)(spec, { month: month - 1 }) : (0, date_fns_1.set)(spec, { month: (0, random_1.intOf)(0, 11) });
                spec = typeof hours === 'number' ? (0, date_fns_1.set)(spec, { hours }) : (0, date_fns_1.set)(spec, { hours: (0, random_1.intOf)(0, 23) });
                spec = typeof minutes === 'number' ? (0, date_fns_1.set)(spec, { minutes }) : (0, date_fns_1.set)(spec, { minutes: (0, random_1.intOf)(0, 59) });
                spec = typeof seconds === 'number' ? (0, date_fns_1.set)(spec, { seconds }) : (0, date_fns_1.set)(spec, { seconds: (0, random_1.intOf)(0, 59) });
                spec = typeof milliseconds === 'number' ? (0, date_fns_1.set)(spec, { milliseconds }) : (0, date_fns_1.set)(spec, { milliseconds: (0, random_1.intOf)(0, 999) });
                spec = typeof date === 'number' ? (0, date_fns_1.set)(spec, { date }) : (0, date_fns_1.set)(spec, { date: (0, random_1.intOf)(1, (0, fp_1.getDaysInMonth)(spec)) });
                if (typeof week === 'number') {
                    week = week - 1;
                    if ((0, fp_1.getWeek)(spec) !== week) {
                        let start = (0, date_fns_1.startOfWeek)(spec, { weekStartsOn: week });
                        if (!(0, fp_1.isSameMonth)(start, spec)) {
                            return (0, date_fns_1.nextDay)(spec, week);
                        }
                    }
                }
                return spec;
            };
        }
        ret[_1.SamplerSymbol] = true;
        return ret;
    }
    differ() {
        let self = this;
        let ret;
        if (isDate(self.ptn)) {
            function* retf(data) {
                if (!(data instanceof Date) || data.getTime() !== self.ptn.getTime()) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    };
                }
            }
            ret = retf;
        }
        else if (isDateRange(self.ptn)) {
            let [start, end] = self.ptn;
            function* retf(data) {
                if (!(data instanceof Date) || (0, fp_1.isAfter)(start, data) || (0, fp_1.isBefore)(end, data)) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    };
                }
            }
            ret = retf;
        }
        else if (isDateArray(self.ptn)) {
            function* retf(data) {
                if (!(data instanceof Date) || self.ptn.find(x => x.getTime() === data.getTime()) === undefined) {
                    return {
                        key: [],
                        expect: self.ptn,
                        got: data
                    };
                }
            }
            ret = retf;
        }
        else if (isDateRangeArray(self.ptn)) {
            function* retf(data) {
                if (data instanceof Date) {
                    let ptn = self.ptn;
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i];
                        if ((0, fp_1.isAfter)(data, start) && (0, fp_1.isBefore)(data, end)) {
                            return;
                        }
                    }
                }
                return {
                    key: [],
                    expect: self.ptn,
                    got: data
                };
            }
            ret = retf;
        }
        else if (isDateSpec(self.ptn)) {
            let spec = self.ptn;
            function* retf(data) {
                if (data instanceof Date) {
                    let year = (typeof spec.year !== 'number' || (0, fp_1.getYear)(data) === spec.year);
                    let month = (typeof spec.month !== 'number' || (0, fp_1.getMonth)(data) + 1 === spec.month);
                    let date = (typeof spec.date !== 'number' || (0, fp_1.getDate)(data) === spec.date);
                    let week = (typeof spec.week !== 'number' || (0, fp_1.getDay)(data) + 1 === spec.week);
                    let hour = (typeof spec.hours !== 'number' || (0, fp_1.getHours)(data) === spec.hours);
                    let minute = (typeof spec.minutes !== 'number' || (0, fp_1.getMinutes)(data) === spec.minutes);
                    let second = (typeof spec.seconds !== 'number' || (0, fp_1.getSeconds)(data) === spec.seconds);
                    let milliseconds = (typeof spec.milliseconds !== 'number' || (0, fp_1.getMilliseconds)(data) === spec.milliseconds);
                    if (year && month && date && week && hour && minute && second && milliseconds) {
                        return;
                    }
                }
                return {
                    key: [],
                    expect: self.ptn,
                    got: data
                };
            }
            ret = retf;
        }
        ret[_1.DifferSymbol] = true;
        return ret;
    }
    matcher() {
        let self = this;
        let ret;
        if (isDate(self.ptn)) {
            ret = (datetime) => (datetime instanceof Date) && datetime.getTime() === self.ptn.getTime();
        }
        else if (isDateRange(self.ptn)) {
            let [start, end] = self.ptn;
            ret = (datetime) => (datetime instanceof Date) && (0, fp_1.isAfter)(datetime, start) && (0, fp_1.isBefore)(datetime, end);
        }
        else if (isDateArray(self.ptn)) {
            ret = (datetime) => (datetime instanceof Date) && self.ptn.find(x => x.getTime() === datetime.getTime()) !== undefined;
        }
        else if (isDateRangeArray(self.ptn)) {
            ret = (datetime) => {
                if (datetime instanceof Date) {
                    let ptn = self.ptn;
                    for (let i = 0; i < ptn.length; ++i) {
                        let [start, end] = ptn[i];
                        if ((0, fp_1.isAfter)(datetime, start) && (0, fp_1.isBefore)(datetime, end)) {
                            return true;
                        }
                    }
                }
                return false;
            };
        }
        else if (isDateSpec(self.ptn)) {
            let spec = self.ptn;
            ret = (datetime) => {
                if (datetime instanceof Date) {
                    let year = (typeof spec.year !== 'number' || (0, fp_1.getYear)(datetime) === spec.year);
                    let month = (typeof spec.month !== 'number' || (0, fp_1.getMonth)(datetime) + 1 === spec.month);
                    let date = (typeof spec.date !== 'number' || (0, fp_1.getDate)(datetime) === spec.date);
                    let week = (typeof spec.week !== 'number' || (0, fp_1.getDay)(datetime) + 1 === spec.week);
                    let hour = (typeof spec.hours !== 'number' || (0, fp_1.getHours)(datetime) === spec.hours);
                    let minute = (typeof spec.minutes !== 'number' || (0, fp_1.getMinutes)(datetime) === spec.minutes);
                    let second = (typeof spec.seconds !== 'number' || (0, fp_1.getSeconds)(datetime) === spec.seconds);
                    let milliseconds = (typeof spec.milliseconds !== 'number' || (0, fp_1.getMilliseconds)(datetime) === spec.milliseconds);
                    return year && month && date && week && hour && minute && second && milliseconds;
                }
                return false;
            };
        }
        ret[_1.MatcherSymbol] = true;
        return ret;
    }
}
function makeDate(pattern) {
    return new DateClass(pattern);
}
exports.default = makeDate;
