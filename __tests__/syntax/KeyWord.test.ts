import KeyWord, { isKeyWord } from "../../src/syntax/KeyWord";

describe('Key word test', () => {
    it('not key word test', () => {
        expect(isKeyWord('abra')).toBe(false);
    });

    it('is key word test', () => {
        expect(isKeyWord(KeyWord.if)).toBe(true);
        expect(isKeyWord(KeyWord.else)).toBe(true);
        expect(isKeyWord(KeyWord.then)).toBe(true);
        expect(isKeyWord(KeyWord.f)).toBe(true);
        expect(isKeyWord(KeyWord.true)).toBe(true);
        expect(isKeyWord(KeyWord.false)).toBe(true);
        expect(isKeyWord('else')).toBe(true);
    });
});
