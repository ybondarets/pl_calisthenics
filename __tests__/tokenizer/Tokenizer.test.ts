import InputStream from "../../src/input/InputStream";
import Tokenizer from "../../src/tokenizer/Tokenizer";
import TokenType from "../../src/tokenizer/TokenType";
import Token from "../../src/tokenizer/Token";

describe('Tokenizer test', () => {
    const createInput = (source: string = ''): InputStream => {
        return new InputStream(source);
    };

    const createTokenizer = (input: InputStream): Tokenizer => {
        return new Tokenizer(input);
    };

    it('create test', () => {
        const tokenizer = createTokenizer(createInput());
        expect(tokenizer).toBeInstanceOf(Tokenizer);
    });

    it('current test', () => {
        const tokenizer = createTokenizer(createInput());
        expect(tokenizer.current()).toBe(null);
    });

    it('whitespaces input',  () => {
        const tokenizer = createTokenizer(createInput(`   
              
            
        `));
        expect(tokenizer.current()).toBe(null);
    });

    it('comments input', () => {
        const tokenizer = createTokenizer(createInput(`   
              # some comment
        #`));
        expect(tokenizer.current()).toBe(null);
    });

    it('string literal test', () => {
        const tokenizer = createTokenizer(createInput(`   
              # some comment
              "and string literal with \n \t escaped character inside. and for and f"
        `));

        const token = tokenizer.current();

        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.String);
        expect((token as Token).getValue()).toBe("and string literal with \n \t escaped character inside. and for and f");
    });

    it('parse number test', () => {
        const tokenizer = createTokenizer(createInput(`
              1234.1234
        `));

        const token = tokenizer.current();

        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Number);
        expect((token as Token).getValue()).toBe(1234.1234);
    });
});
