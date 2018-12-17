import { LocaleMessages } from '../LocaleMessages';

export interface Node<T> {
  format(value: T, localMessages: LocaleMessages): string | never;
}

export namespace Node {
  export function of<T>(lambda: (d: T, m: LocaleMessages) => string): Node<T> {
    return { format: lambda };
  }
}
