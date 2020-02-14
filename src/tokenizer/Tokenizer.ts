import InputStream from "../input/InputStream";
import Token from "./Token";
import TokenType from "./TokenType";

export default class Tokenizer {
    private input: InputStream;
    private currentToken: any;

    public constructor(input: InputStream) {
        this.input = input;
    }

    public current(): null {
        if (!this.currentToken) {
            this.currentToken = this.readNext();
        }

        return this.currentToken;
    }

    private readNext(): Token|null {
        this.readUntil(this.isWhitespace);
        if (this.input.eof()) return null;

        const symbol = this.input.current();

        switch (true) {
            case this.isCommentStart(symbol):
                this.nextLine();
                return this.readNext();
            case this.isStringStart(symbol):
                return this.readString();
            case this.isNumber(symbol):
                return this.readNumber();
            default:
                this.input.error(`Can't handle character ${this.input.current()}`);
        }
    }

    private readNumber(): Token {
        let hasDot = false;
        const value = this.input.current() + this.readUntil((symbol: string): boolean => {
            if (this.input.current() === '.') {
                if (hasDot) {
                    return false;
                } else {
                    hasDot = true;
                    return true;
                }
            }

            return this.isNumber(symbol);
        });

        return new Token(TokenType.Number, parseFloat(value));
    }

    private isNumber(symbol: string): boolean {
        return /\d/.test(symbol);
    }

    private isStringStart(symbol: string): boolean {
        return symbol === '"';
    }

    private readString(): Token {
        return new Token(TokenType.String, this.readStringContent());
    }

    private readStringContent(): string {
        let result = '';
        this.input.next();

        while (this.input.eof() === false && !this.isStringStart(this.input.current())) {
            result += this.input.current();
            this.input.next();
        }

        return result;
    }

    private nextLine(): void {
        this.readUntil((symbol: string) => symbol !== '\n');
        this.input.next();
    }

    private isCommentStart(symbol: string): boolean {
        return symbol === '#';
    }

    private readUntil(criteria: (character: string) => boolean): string {
        return this.input.eof() === false && criteria(this.input.current()) ?
            this.input.next() + this.readUntil(criteria) :
            '';
    }

    private isWhitespace(character: string): boolean {
        return ' \t\n'.indexOf(character) >= 0;
    }
}

// if (is_id_start(ch)) return read_ident();
// if (is_punc(ch)) return {
//     type  : "punc",
//     value : input.next()
// };
// if (is_op_char(ch)) return {
//     type  : "op",
//     value : read_while(is_op_char)
// };