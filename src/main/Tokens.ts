import { Node } from "./compile/Node";
import { NodeFactory } from "./compile/NodeFactory";
import { DateTimeAccessor } from './DateTimeAccessor';
import { ISO8601Helper } from './ISO8601Helper';

class MonoNodeFactory<T> implements NodeFactory<T> {

  constructor(public readonly token: string, private node: Node<T>) { }

  forOccurrence(): Node<T> {
    return this.node;
  }
}

function pad(s: any, n: number): string {
  if (typeof s !== 'string') s = String(s);
  while (s.length < n) s = '0' + s;
  return s;
}

class PaddedNumberNodeFactory<T> implements NodeFactory<T> {

  constructor(public readonly token: string, private lambda: (d: T) => number) { }

  forOccurrence(n: number): Node<T> {
    return Node.of(d => pad(String(this.lambda(d)), n));
  }
}

class ZoneNode implements Node<DateTimeAccessor> {

  constructor(private lambda: (offset: number, sign: string, hours: number, minutes: number) => string) { }

  format(d: DateTimeAccessor): string {
    const offset = d.getTimezoneOffset();
    const abs = Math.abs(offset);
    return this.lambda(offset, offset > 0 ? '-' : '+', Math.floor(abs / 60), abs % 60);
  }
}

class YearNodeFactory implements NodeFactory<DateTimeAccessor> {

  private readonly short: Node<DateTimeAccessor>
  private readonly full: Node<DateTimeAccessor>;

  constructor(public readonly token: string, lambda: (d: DateTimeAccessor) => number) {
    this.short = Node.of(d => String(lambda(d) % 100));
    this.full = Node.of(d => String(lambda(d)));
  }

  forOccurrence(n: number): Node<DateTimeAccessor> {
    return n < 3 ? this.short : this.full;
  }
}

/**
 *  Era designator.	Text (AD)
 */
export const G = new MonoNodeFactory<DateTimeAccessor>('G', Node.of(d => d.getFullYear() < 0 ? 'BC' : 'AD'));

/**
 * Year. Number
 * Examples:
 *  1996 (yyyy or more)
 *  96 (yyy or less)
 */
export const y = new YearNodeFactory('y', d => d.getFullYear());

/**
 * Week based year.
 * Examples:
 *  2009 (YYYY or more)
 *  09 (YYY or less)
 */
export const Y = new YearNodeFactory('Y', ISO8601Helper.weekBasedYear);

/**
 * Month in year. Number or text.
 * Examples:
 *  July (MMMM or more)
 *  Jul (MMM)
 *  07 (MM)
 *  7 (M)
 */
export const M = new class implements NodeFactory<DateTimeAccessor> {

  public readonly token = 'M';

  private readonly num = Node.of<DateTimeAccessor>(d => String(d.getMonth() + 1));
  private readonly padded = Node.of<DateTimeAccessor>(d => pad(d.getMonth() + 1, 2));
  private readonly short = Node.of<DateTimeAccessor>((d, m) => m['months.short.' + (d.getMonth() + 1)]);
  private readonly full = Node.of<DateTimeAccessor>((d, m) => m['months.full.' + (d.getMonth() + 1)]);

  forOccurrence(n: number): Node<DateTimeAccessor> {
    switch (n) {
      case 1: return this.num;
      case 2: return this.padded;
      case 3: return this.short;
      default: return this.full;
    }
  }
};

/**
 * Week in year. Number.
 */
export const w = new PaddedNumberNodeFactory<DateTimeAccessor>('w', ISO8601Helper.weekOfYear);

/**
 * Week in month. Number.
 */
export const W = new PaddedNumberNodeFactory<DateTimeAccessor>('W', ISO8601Helper.weekOfMonth);

/**
 * Day in year. Number.
 */
export const D = new PaddedNumberNodeFactory<DateTimeAccessor>('D', ISO8601Helper.dayOfYear);

/**
 * Day in month. Number (1 - 31).
 */
export const d = new PaddedNumberNodeFactory<DateTimeAccessor>('d', d => d.getDate());

/**
 * Day of week in month. Number.
 */
export const F = new PaddedNumberNodeFactory<DateTimeAccessor>('F', ISO8601Helper.dayOfWeekInMonth);

/**
 * Day name in week. Text.
 * Examples:
 * 	Tuesday (EEEE or more)
 *  Tue (EEE or less)
 */
export const E = new class implements NodeFactory<DateTimeAccessor> {

  public readonly token = 'E';

  private readonly short = Node.of<DateTimeAccessor>((d, m) => m['weekdays.short.' + ISO8601Helper.dayOfWeek(d)]);

  private readonly full = Node.of<DateTimeAccessor>((d, m) => m['weekdays.full.' + ISO8601Helper.dayOfWeek(d)]);

  forOccurrence(n: number): Node<DateTimeAccessor> {
    return n < 4 ? this.short : this.full;
  }
};

/**
 * Day number of week(1 = Monday, ..., 7 = Sunday). Number (1 - 7).
 */
export const u = new PaddedNumberNodeFactory<DateTimeAccessor>('u', d => ISO8601Helper.dayOfWeek(d));

/**
 * AM/PM marker. Text (AM | PM).
 */
export const a = new MonoNodeFactory<DateTimeAccessor>('a', Node.of(d => d.getHours() < 12 ? 'AM' : 'PM'));

/**
 * Hour in day. Number (0 - 23).
 */
export const H = new PaddedNumberNodeFactory<DateTimeAccessor>('H', d => d.getHours());

/**
 * Hour in day.	Number (1 - 24).
 */
export const k = new PaddedNumberNodeFactory<DateTimeAccessor>('k', d => {
  const h = d.getHours();
  return h === 0 ? 24 : h;
});

/**
 * Hour in am / pm. Number (0 - 11).
 */
export const K = new PaddedNumberNodeFactory<DateTimeAccessor>('K', d => d.getHours() % 12);

/**
 * Hour in am / pm. Number (1 - 12).
 */
export const h = new PaddedNumberNodeFactory<DateTimeAccessor>('h', d => {
  const h = d.getHours() % 12;
  return h === 0 ? 12 : h;
});

/**
 * Minute in hour. Number (0 - 59).
 */
export const m = new PaddedNumberNodeFactory<DateTimeAccessor>('m', d => d.getMinutes());

/**
 * Second in minute. Number (0 - 59).
 */
export const s = new PaddedNumberNodeFactory<DateTimeAccessor>('s', d => d.getSeconds());

/**
 * Millisecond. Number (0 - 999).
 */
export const S = new PaddedNumberNodeFactory<DateTimeAccessor>('S', d => d.getMilliseconds());

/**
 * Time zone. General time zone.
 * Named timezones are not supported.
 * Only GMTOffsetTimeZone.
 *
 * Example: GMT-08:00
 */
export const z = new MonoNodeFactory<DateTimeAccessor>('z', new ZoneNode(
  (offset, sign, hours, minutes) => offset === 0 ?
    'GMT' : ('GMT' + sign + pad(hours, 2) + ':' + pad(minutes, 2))));

/**
 * Time zone. RFC 822 time zone.
 * Example: -0800.
 */
export const Z = new MonoNodeFactory<DateTimeAccessor>('Z', new ZoneNode(
  (offset, sign, hours, minutes) => sign + pad(hours, 2) + pad(minutes, 2)));

/**
 * Time zone. ISO 8601 time zone.
 * Examples:
 *  -08 (X)
 *  -0800 (XX)
 *  -08:00 (XXX or more)
 */
export const X = new class implements NodeFactory<DateTimeAccessor> {

  public readonly token = 'X';

  private readonly node1 = new ZoneNode((offset, sign, hours, minutes) => sign + pad(hours, 2));
  private readonly node2 = new ZoneNode((offset, sign, hours, minutes) => sign + pad(hours, 2) + pad(minutes, 2));
  private readonly node3 = new ZoneNode((offset, sign, hours, minutes) => sign + pad(hours, 2) + ':' + pad(minutes, 2));

  forOccurrence(n: number): ZoneNode {
    switch (n) {
      case 1: return this.node1;
      case 2: return this.node2;
      default: return this.node3;
    }
  }
};
