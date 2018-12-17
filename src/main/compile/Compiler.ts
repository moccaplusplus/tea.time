import { Node } from './Node';
import { NodeFactory } from "./NodeFactory";
import { Parser } from './Parser';

export type CompiledPattern<T> = ReadonlyArray<Node<T>>;

export class Compiler<T> {

  protected tokenFactoryMap: { [K: string]: NodeFactory<T> } = {};

  constructor(...factories: Array<NodeFactory<T>>) {
    factories.forEach(f => this.tokenFactoryMap[f.token] = f);
  }

  compile(pattern: string): CompiledPattern<T> {
    return Parser.parse(pattern).map(lexeme => this.toHandler(lexeme));
  }

  protected toHandler(lexeme: Parser.Lexeme): Node<T> {
    if (lexeme.type === Parser.LEXEME_TYPE_TOKEN) {
      const factory = this.tokenFactoryMap[lexeme.token];
      if (factory) return factory.forOccurrence(lexeme.count);
      return new NoInterpretBlob(lexeme.token);
    }
    return new NoInterpretBlob(lexeme.text);
  }
}

class NoInterpretBlob implements Node<any> {
  constructor(private blob: string) { }
  format(): string {
    return this.blob;
  }
}
