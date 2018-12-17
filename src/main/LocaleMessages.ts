export type SimpleMap<K extends string = string, V = any> = { [key in K]: V };
export type Dictionary<K extends string = string, V extends string = string> = SimpleMap<K, V>;
export type LocaleMessages = Dictionary<string, string>;
