import { CompiledPattern, Compiler } from './compile/Compiler';
import { DateTimeAccessor } from './DateTimeAccessor';
import { LocaleMessages } from './LocaleMessages';
import { a, d, D, E, F, G, h, H, k, K, m, M, s, S, u, w, W, X, y, Y, z, Z } from './Tokens';

export class DateTimeFormatter {

  public static readonly FORMATS = new class Formats {

    readonly DEFAULT = 'yyyy-MM-dd HH:mm:ss';

    readonly DATE_SHORT = 'm/d/yy';
    readonly DATE_MEDIUM = 'MMM d, yyyy';
    readonly DATE_LONG = 'MMMM d, yyyy';
    readonly DATE_FULL = 'dddd, MMMM d, yyyy';
    readonly ISO_DATE = 'yyyy-MM-dd';

    readonly TIME_SHORT = 'h:mm TT';
    readonly TIME_MEDIUM = 'h:mm:ss TT';
    readonly TIME_LONG = 'h:mm:ss TT Z';
    readonly ISO_TIME = 'HH:mm:ss';

    readonly ISO_DATE_TIME = 'yyyy-MM-dd\'T\'HH:mm:ss';
    readonly EXPIRES_HEADER_FORMAT = 'ddd, dd MMM yyyy HH:mm:ss Z';
  };

  protected static readonly COMPILER = new Compiler<DateTimeAccessor>(
    a, d, D, E, F, G, h, H, k, K, m, M, s, S, u, w, W, X, y, Y, z, Z);

  protected static readonly DEFAULT_LOCALE = 'en';

  protected static readonly LOCALE_MESSAGES: { [key: string]: LocaleMessages } = {};

  protected readonly compiledPattern: CompiledPattern<DateTimeAccessor>;
  public readonly defaultLocale: string;

  public static format(date: DateTimeAccessor, format: string = DateTimeFormatter.FORMATS.DEFAULT, locale?: string): string {
    return new DateTimeFormatter(format, locale).format(date);
  }

  // TODO:
  // public static parse(input: string, result: DateTimeMutator, format: string = DateTimeFormatter.FORMATS.DEFAULT, locale?: string): void {
  // }

  public static registerLocaleMessages(locale: string, messages: LocaleMessages): void {
    DateTimeFormatter.LOCALE_MESSAGES[locale] = messages;
  }

  private static verifiedLocale(locale?: string, defaultLocale: string = this.DEFAULT_LOCALE): string {
    return locale && locale in this.LOCALE_MESSAGES ? locale : defaultLocale;
  }

  private static getMessages(locale?: string, defaultLocale: string = this.DEFAULT_LOCALE): LocaleMessages {
    return this.LOCALE_MESSAGES[this.verifiedLocale(locale, defaultLocale)];
  }

  constructor(pattern: string, locale?: string) {
    this.compiledPattern = DateTimeFormatter.COMPILER.compile(pattern);
    this.defaultLocale = DateTimeFormatter.verifiedLocale(locale);
  }

  public format(input: DateTimeAccessor, locale?: string): string {
    const localeMessages = DateTimeFormatter.getMessages(locale, this.defaultLocale);
    return this.compiledPattern.map(node => node.format(input, localeMessages)).join('');
  }

  // TODO:
  // public parse(input: string, result: DateTimeMutator, locale?: string): void {
  // }
}

