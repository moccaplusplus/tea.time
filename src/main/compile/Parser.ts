export namespace Parser {

  export const LEXEME_TYPE_TOKEN = 1;
  export const LEXEME_TYPE_BLOB = 2;

  export interface TokenLexeme {
    type: typeof LEXEME_TYPE_TOKEN;
    token: string;
    count: number;
  }

  export interface BlobLexeme {
    type: typeof LEXEME_TYPE_BLOB;
    text: string;
  }

  export type Lexeme = TokenLexeme | BlobLexeme;
  export type LexemeStream = Array<Lexeme>;

  export function parse(pattern: string): LexemeStream {
    if (!pattern) return [];

    const reg = /(?:([a-zA-z])\1*)|(?:(')[^']*')|(?:[^a-zA-Z']+)/g;
    const dirtyStream: Array<Lexeme | null> = [];
    for (let regMatch = reg.exec(pattern); regMatch; regMatch = reg.exec(pattern)) {
      const lexeme = regMatch[0];
      const letter = regMatch[1];
      const quote = regMatch[2];
      if (letter) {
        dirtyStream.push(token(letter, lexeme.length));
      } else if (quote) {
        if (lexeme.length > 2) {
          dirtyStream.push(null, blob(lexeme.substring(1, lexeme.length - 1)), null);
        } else {
          dirtyStream.push(null, null);
        }
      } else {
        dirtyStream.push(blob(lexeme));
      }
    }
    return mergeAdjacentText(cleanupQuotes(dirtyStream));
  }

  function blob(text: string): BlobLexeme {
    return { type: LEXEME_TYPE_BLOB, text };
  }

  function token(token: string, count: number = 1): TokenLexeme {
    return { type: LEXEME_TYPE_TOKEN, token, count };
  }

  function cleanupQuotes(dirtyStream: Array<Lexeme | null>): LexemeStream {
    const resultStream: LexemeStream = [];
    let flag = false;
    for (let i = 0; i < dirtyStream.length; i++) {
      let lexeme = dirtyStream[i];
      if (lexeme === null) {
        if (!flag) {
          flag = true;
          continue;
        }

        lexeme = blob('\'');
      }
      flag = false;
      resultStream.push(lexeme);
    }
    return resultStream;
  }

  function mergeAdjacentText(stream: LexemeStream): LexemeStream {
    if (stream.length < 1) return stream;

    const resultStream: LexemeStream = [stream[0]];
    for (let i = 1; i < stream.length; i++) {
      const lexeme = stream[i];
      if (lexeme.type === LEXEME_TYPE_BLOB) {
        const top = resultStream[resultStream.length - 1];
        if (top.type === LEXEME_TYPE_BLOB) {
          top.text += lexeme.text;
          continue;
        }
      }
      resultStream.push(lexeme);
    }
    return resultStream;
  }
}

