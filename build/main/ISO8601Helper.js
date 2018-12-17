"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper function for ISO-8601 day of week and week number.
 *
 * The ISO 8601 standard defines week numbers using a Monday-based week (i.e. the week begins on Monday).
 * Under this definition, the first week of the year is determined to be the first week that contains a Wednesday.
 * For example, January 1, 2003 was on a Wednesday; therfore the week it lies in is week number 1 of 2003.
 * However, January 1, 2006 started on a Sunday; under the ISO 8601 week definition, this is considered
 * the 52nd week of 2005.
 */
var ISO8601Helper;
(function (ISO8601Helper) {
    var DAY_MILLIS = 1000 * 60 * 60 * 24;
    var SAKAMOTO_OFFSET_TABLE = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    /**
     * Sakamoto's algorithm for finding daf of week.
     */
    function sakamotoDayOfWeek(d, m, y) {
        if (m < 3)
            y -= 1;
        return (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + SAKAMOTO_OFFSET_TABLE[m - 1] + d) % 7;
    }
    /**
     * Sakamoto's algorithm to find out the day of week from a given date.
     * The returned value is then adjusted to 1-7 standard range starting with 1 - Monday.
     * The original Sakamoto's algorithm produces result in 0-6 range, starting with 0 - Sunday.
     *
     * For explanation on Sakamoto's algorithm see:
     * https://stackoverflow.com/questions/6385190/correctness-of-sakamotos-algorithm-to-find-the-day-of-week/6385934#6385934
     *
     * @param date Date for which to calculate day of week.
     * @returns Number in range 1-7 where 1 is Monday and 7 is Sunday.
     */
    function dayOfWeek(date) {
        var zeroBasedResult = sakamotoDayOfWeek(date.getDate(), date.getMonth() + 1, date.getFullYear());
        return zeroBasedResult === 0 ? 7 : zeroBasedResult;
    }
    ISO8601Helper.dayOfWeek = dayOfWeek;
    /**
     * Returns the number of this weekday occurence within a month.
     *
     * @param date The date for which to calculate weekday occurence within a month
     * @returns The number of this weekday occurence within a month.
     */
    function dayOfWeekInMonth(date) {
        return Math.ceil(date.getDate() / 7);
    }
    ISO8601Helper.dayOfWeekInMonth = dayOfWeekInMonth;
    /**
     * Returns the day number in year for given date.
     *
     * @param date Tha date for which to get the day number in year.
     * @returns The day number in year for given date.
     */
    function dayOfYear(date) {
        var start = new Date(date.getFullYear(), 0, 1);
        // Quirk due to Javascript Date time zone specifics.
        var end = date instanceof Date ? date : new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var diff = end.valueOf() - start.valueOf();
        return Math.floor(diff / DAY_MILLIS) + 1;
    }
    ISO8601Helper.dayOfYear = dayOfYear;
    /**
     * Return the year, to which the week, which in turn contains the given date, belongs.
     *
     * @param date The date to determine a week based year (e.g. the year, to which the week, which in turn contains the given date, belongs).
     * @returns The year, to which the week, which in turn contains the given date, belongs.
     */
    function weekBasedYear(date) {
        var thursday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek(date) + 4);
        return thursday.getFullYear();
    }
    ISO8601Helper.weekBasedYear = weekBasedYear;
    /**
     * Returns the number of the week in month given by date.
     * We asume the first week in month to be the one which contains
     * the first thursday in that month.
     *
     * @param date Date for which to calculate number of week in month.
     * @returns The number of the week in month given by date.
     */
    function weekOfMonth(date) {
        var thursday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek(date) + 4);
        var day4 = new Date(thursday.getFullYear(), thursday.getMonth(), 4);
        var dayDiff = thursday.getDate() - 4 + dayOfWeek(day4);
        return Math.ceil(dayDiff / 7);
    }
    ISO8601Helper.weekOfMonth = weekOfMonth;
    /**
     * Returns the number of the week in year given by date.
     *
     * CAUTION:
     * ISO 8601 tells that the first week of a year is the one
     * which contains the first thursday in that year.
     *
     * @param date Date for which to calculate number of week in year.
     * @returns The number of the week in year given by date.
     */
    function weekOfYear(date) {
        // Remove time components of date
        var thursday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek(date) + 4);
        // Take January 4th as it is always in week 1 (see ISO 8601)
        var jan4 = new Date(thursday.getFullYear(), 0, 4);
        // Number of days between target date and january 4th
        var dayDiff = dayOfYear(thursday) - 4 + dayOfWeek(jan4);
        // Calculate week number: Week 1 (january 4th) plus the
        // number of weeks between target date and january 4th
        return Math.ceil(dayDiff / 7);
    }
    ISO8601Helper.weekOfYear = weekOfYear;
})(ISO8601Helper = exports.ISO8601Helper || (exports.ISO8601Helper = {}));
//# sourceMappingURL=ISO8601Helper.js.map