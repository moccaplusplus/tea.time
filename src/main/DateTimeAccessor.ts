export interface DateTimeAccessor {
  getDate(): number;
  getMonth(): number;
  getFullYear(): number;
  getHours(): number;
  getMinutes(): number;
  getSeconds(): number;
  getMilliseconds(): number;
  getTimezoneOffset(): number;
  valueOf(): number;
}
