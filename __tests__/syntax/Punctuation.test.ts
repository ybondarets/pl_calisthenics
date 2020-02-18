import Punctuation, { isPunctuation } from "../../src/syntax/Punctuation";

describe('Punctuation test', () => {
    it('not punctuation test', () => {
        expect(isPunctuation('abra')).toBe(false);
    });

    it('is key word test', () => {
        expect(isPunctuation(Punctuation.comma)).toBe(true);
        expect(isPunctuation(Punctuation.semicolon)).toBe(true);
        expect(isPunctuation(Punctuation.openingParenthesis)).toBe(true);
        expect(isPunctuation(Punctuation.closingParenthesis)).toBe(true);
        expect(isPunctuation(Punctuation.openingBrace)).toBe(true);
        expect(isPunctuation(Punctuation.closingBrace)).toBe(true);
        expect(isPunctuation(Punctuation.openingBracket)).toBe(true);
        expect(isPunctuation(Punctuation.closingBracket)).toBe(true);
        expect(isPunctuation(',')).toBe(true);
    });
});
