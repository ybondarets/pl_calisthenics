import Token from "../../src/tokenizer/Token";
import TokenType from "../../src/tokenizer/TokenType";

describe('Token test', () => {
    it('create token', () => {
        const token = new Token(TokenType.String, "some value");
        expect(token).toBeInstanceOf(Token);
    });

    it('invalid type test', () => {
        expect(() => {
            new Token("bad_type" as TokenType, "value");
        }).toThrowError('Token type should be one of "TokenType"');
    });

    it('getType test', () => {
        const type = TokenType.String;
        const value = "token value";
        const token = new Token(type, value);
        expect(token.getType()).toBe(type);
    });

    it('getValue test', () => {
        const type = TokenType.String;
        const value = "token value";
        const token = new Token(type, value);
        expect(token.getValue()).toBe(value);
    });
});
