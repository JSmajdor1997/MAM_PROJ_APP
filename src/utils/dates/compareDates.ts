import { DescendingQuery, QueryKeys } from "./Queries";

export interface ComparisonResult {
    firstBigger: boolean
    equal: boolean
    notEqual: boolean
    firstSmaller: boolean
}

export const DayPrecision: DescendingQuery<boolean> = { year: true, month: true, date: true }

export const MonthPrecision: DescendingQuery<boolean> = { year: true, month: true }

export const YearPrecision: DescendingQuery<boolean> = { year: true }

export const FullPrecision: DescendingQuery<boolean> = { year: true, month: true, date: true, hours: true, minutes: true, seconds: true, miliseconds: true }

export default function compareDates(date1: Date, date2: Date, precision: DescendingQuery<boolean>): ComparisonResult {
    const ascendingPrecision = [
        { propertyName: QueryKeys.Year, getter: (date: Date) => date.getFullYear() },
        { propertyName: QueryKeys.Month, getter: (date: Date) => date.getMonth() },
        { propertyName: QueryKeys.Date, getter: (date: Date) => date.getDate() },
        { propertyName: QueryKeys.Hours, getter: (date: Date) => date.getHours() },
        { propertyName: QueryKeys.Minutes, getter: (date: Date) => date.getMinutes() },
        { propertyName: QueryKeys.Seconds, getter: (date: Date) => date.getSeconds() },
        { propertyName: QueryKeys.Miliseconds, getter: (date: Date) => date.getMilliseconds() }
    ]

    for (const definedPrecision of ascendingPrecision) {
        if (definedPrecision.propertyName in precision) {
            const value1 = definedPrecision.getter(date1);
            const value2 = definedPrecision.getter(date2);

            if (value1 !== value2) {
                return {
                    firstSmaller: value1 < value2,
                    equal: false,
                    notEqual: true,
                    firstBigger: value1 > value2
                }
            }
        }
    }

    return {
        firstSmaller: false,
        equal: true,
        notEqual: false,
        firstBigger: false
    }
}