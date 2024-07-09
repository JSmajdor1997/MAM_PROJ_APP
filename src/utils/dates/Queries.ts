export enum QueryKeys {
    Year = "year", 
    Month = "month",
    Date = "date", 
    Hours = "hours", 
    Minutes = "minutes", 
    Seconds = "seconds",
    Miliseconds = "miliseconds"
}

export type Query<T extends boolean | number> = { [key in QueryKeys]: T }
export type DescendingQuery<T extends boolean | number> = 
    {[QueryKeys.Year]: T, [QueryKeys.Month]?: never, [QueryKeys.Date]?: never, [QueryKeys.Hours]?: never, [QueryKeys.Minutes]?: never, [QueryKeys.Seconds]?: never, [QueryKeys.Miliseconds]?: never} | 
    {[QueryKeys.Year]: T, [QueryKeys.Month]: T, [QueryKeys.Date]?: never, [QueryKeys.Hours]?: never, [QueryKeys.Minutes]?: never, [QueryKeys.Seconds]?: never, [QueryKeys.Miliseconds]?: never} | 
    {[QueryKeys.Year]: T, [QueryKeys.Month]: T, [QueryKeys.Date]: T, [QueryKeys.Hours]?: never, [QueryKeys.Minutes]?: never, [QueryKeys.Seconds]?: never, [QueryKeys.Miliseconds]?: never} | 
    {[QueryKeys.Year]: T, [QueryKeys.Month]: T, [QueryKeys.Date]: T, [QueryKeys.Hours]: T, [QueryKeys.Minutes]?: never, [QueryKeys.Seconds]?: never, [QueryKeys.Miliseconds]?: never} | 
    {[QueryKeys.Year]: T, [QueryKeys.Month]: T, [QueryKeys.Date]: T, [QueryKeys.Hours]: T, [QueryKeys.Minutes]: T, [QueryKeys.Seconds]?: never, [QueryKeys.Miliseconds]?: never} | 
    {[QueryKeys.Year]: T, [QueryKeys.Month]: T, [QueryKeys.Date]: T, [QueryKeys.Hours]: T, [QueryKeys.Minutes]: T, [QueryKeys.Seconds]: T, [QueryKeys.Miliseconds]?: never} |
    Query<T>