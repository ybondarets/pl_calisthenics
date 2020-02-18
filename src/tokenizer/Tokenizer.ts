import InputStream from "../input/InputStream";
import Token from "./Token";
import TokenType from "./TokenType";
import {isKeyWord} from "../syntax/KeyWord";
import {isPunctuation} from "../syntax/Punctuation";
import {isOperator} from "../syntax/Operator";

export default class Tokenizer {
    private input: InputStream;
    private currentToken: any = null;

    public constructor(input: InputStream) {
        this.input = input;
    }

    public current(): Token|null {
        if (this.currentToken === null) {
            this.currentToken = this.readNext();
        }

        return this.currentToken;
    }

    public next(): Token|null {
        const current = this.currentToken;
        this.currentToken = null;

        return current === null ? this.readNext() : current;
    }

    public reset(): void {
        this.input.reset();
        this.currentToken = null;
    }

    public eof(): boolean {
        return this.current() === null;
    }

    private readNext(): Token|null {
        this.readUntil((symbol: string) => this.isWhitespace(symbol));
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
            case this.isIdentifierStart(symbol):
                return this.readIdentifier();
            case this.isPunctuation(symbol):
                return this.readPunctuation();
            case this.isOperator(symbol):
                return this.readOperator();
            default:
                this.input.error(`Can't handle character ${this.input.current()}`);
        }
    }

    private isOperator(symbol: string): boolean {
        return isOperator(symbol);
    }

    private readOperator(): Token {
        const value = this.readUntil(isOperator);

        return new Token(TokenType.Operator, value);
    }

    private isPunctuation(symbol: string): boolean {
        return isPunctuation(symbol);
    }

    private readPunctuation(): Token {
        const value = this.input.current();
        this.input.next();
        return new Token(TokenType.Punctuation, value);
    }

    private isIdentifierStart(symbol: string): boolean {
        return /[a-z_]/i.test(symbol);
    }

    private readIdentifier(): Token {
        const value = this.readUntil((symbol: string): boolean => {
            return this.isIdentifier(symbol);
        });

        const type = this.isKeyWord(value) ?
            TokenType.KeyWord :
            TokenType.Identifier;

        return new Token(type, value);
    }

    private isKeyWord(word: string): boolean {
        return isKeyWord(word);
    }

    private isIdentifier(symbol: string): boolean {
        return this.isIdentifierStart(symbol) || "0123456789-><=!?".indexOf(symbol) >= 0;
    }

    private readNumber(): Token {
        let hasDot = false;
        const value = this.readUntil((symbol: string): boolean => {
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
        let result = "";
        while (!this.input.eof()) {
            let ch = this.input.next();
            if (this.isStringStart(ch)) {
                break;
            } else {
                result += ch;
            }
        }
        this.input.next();

        return result;
    }

    private nextLine(): void {
        this.readUntil((symbol: string) => symbol !== '\n');
    }

    private isCommentStart(symbol: string): boolean {
        return symbol === '#';
    }

    private readUntil(criteria: (character: string) => boolean): string {
        let result = "";

        while (this.input.eof() === false && criteria(this.input.current())) {
            result += this.input.current();
            this.input.next();
        }

        return result;
    }

    private isWhitespace(character: string): boolean {
        return ' \t\n'.indexOf(character) >= 0;
    }
}
