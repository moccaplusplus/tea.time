import { DateTimeAccessor } from '../main/DateTimeAccessor';
import { ISO8601Helper } from '../main/ISO8601Helper';

describe('ISO8601Helper', () => {

  it('dayOfWeek', function () {
    let date: DateTimeAccessor, result: number;

    date = new Date(2018, 10, 1);
    result = ISO8601Helper.dayOfWeek(date);
    expect(result).toBe(4);

    date = new Date(2018, 10, 17);
    result = ISO8601Helper.dayOfWeek(date);
    expect(result).toBe(6);

    date = new Date(2010, 7, 31);
    result = ISO8601Helper.dayOfWeek(date);
    expect(result).toBe(2);
  });

  it('dayOfWeekInMonth', function () {
    let date: DateTimeAccessor, result: number;

    date = new Date(2018, 10, 1);
    result = ISO8601Helper.dayOfWeekInMonth(date);
    expect(result).toBe(1);

    date = new Date(2018, 10, 17);
    result = ISO8601Helper.dayOfWeekInMonth(date);
    expect(result).toBe(3);

    date = new Date(2010, 7, 31);
    result = ISO8601Helper.dayOfWeekInMonth(date);
    expect(result).toBe(5);

    date = new Date(2010, 7, 28);
    result = ISO8601Helper.dayOfWeekInMonth(date);
    expect(result).toBe(4);
  });

  it('dayOfYear', function () {
    let date: DateTimeAccessor, result: number;

    date = new Date(2018, 0, 3, 23, 59, 59, 999);
    result = ISO8601Helper.dayOfYear(date);
    expect(result).toBe(3);

    date = new Date(2018, 2, 3);
    result = ISO8601Helper.dayOfYear(date);
    expect(result).toBe(62);

    date = new Date(2020, 2, 3);
    result = ISO8601Helper.dayOfYear(date);
    expect(result).toBe(63);

    date = new Date(2020, 11, 31);
    result = ISO8601Helper.dayOfYear(date);
    expect(result).toBe(366);

    date = new Date(2019, 11, 31);
    result = ISO8601Helper.dayOfYear(date);
    expect(result).toBe(365);
  });

  it('weekBasedYear', function () {
    let date: DateTimeAccessor, result: number;

    date = new Date(2018, 11, 31);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2019);

    date = new Date(2019, 0, 1);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2019);

    date = new Date(2018, 11, 30);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2018);

    date = new Date(2019, 11, 31);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2020);

    date = new Date(2019, 11, 30);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2020);

    date = new Date(2019, 11, 29);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2019);

    date = new Date(2017, 11, 31);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2017);

    date = new Date(2018, 0, 1);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2018);

    date = new Date(2018, 0, 4);
    result = ISO8601Helper.weekBasedYear(date);
    expect(result).toBe(2018);
  });

  it('weekOfMonth', function () {
    let date: DateTimeAccessor, result: number;

    date = new Date(2018, 10, 1);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(1);

    date = new Date(2018, 9, 31);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(1);

    date = new Date(2018, 11, 31);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(1);

    date = new Date(2018, 11, 1);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(5);

    date = new Date(2018, 11, 2);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(5);

    date = new Date(2018, 11, 3);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(1);

    date = new Date(2018, 10, 30);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(5);

    date = new Date(2018, 10, 17);
    result = ISO8601Helper.weekOfMonth(date);
    expect(result).toBe(3);
  });

  it('weekOfYear', function () {
    let date: DateTimeAccessor, result: number;

    date = new Date(2018, 0, 1);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(1);

    date = new Date(2018, 0, 7);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(1);

    date = new Date(2018, 0, 8);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(2);

    date = new Date(2017, 11, 31);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(52);

    date = new Date(2017, 0, 2);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(1);

    date = new Date(2017, 0, 1);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(52);

    date = new Date(2016, 0, 2);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(53);

    date = new Date(2018, 11, 31);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(1);

    date = new Date(2018, 11, 30);
    result = ISO8601Helper.weekOfYear(date);
    expect(result).toBe(52);
  })
});
