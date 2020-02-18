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

    it('next test', () => {
        const tokenizer = createTokenizer(createInput(`
              1234.1234 "some string"
        `));

        let token = tokenizer.next();

        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Number);

        token = tokenizer.next();
        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.String);
    });

    it('parse keyword', () => {
        const tokenizer = createTokenizer(createInput(`
              if some-identifier than return-one else return-two;
        `));

        let token = tokenizer.next();

        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.KeyWord);
        expect((token as Token).getValue()).toBe('if');

        token = tokenizer.next();
        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Identifier);
        expect((token as Token).getValue()).toBe('some-identifier');
    });

    it('parse punctuation', () => {
        const tokenizer = createTokenizer(createInput(`
              hi();
        `));
        tokenizer.next();
        const token = tokenizer.next();
        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Punctuation);
        expect((token as Token).getValue()).toBe('(');
    });

    it('parse operator', () => {
        const tokenizer = createTokenizer(createInput(`
              a <= b;
        `));
        tokenizer.next();
        const token = tokenizer.next();
        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Operator);
        expect((token as Token).getValue()).toBe('<=');
    });

    it('reset test', () => {
        const tokenizer = createTokenizer(createInput(`
              a <= b;
        `));
        tokenizer.next();
        tokenizer.reset();
        const token = tokenizer.current();
        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Identifier);
        expect((token as Token).getValue()).toBe('a');
    });

    it('eof test', () => {
        const tokenizer = createTokenizer(createInput(`
        `));
        expect(tokenizer.eof()).toBe(true);
    });

    it('general test', () => {
        const tokenizer = createTokenizer(createInput(`
            # comment
            # Other comment will be ignored
            print("some text"); # function call
            print(3 < 1 * 2 / 13); # passing epression to the function call
            
            factorial = f(x) { # functions is a data too, we can declare function by \`f\` keyword
                if x <= 1 then
                    1
                else
                    n * factorial(x - 1)
            };
            
            if (1 > 2) {
                print("Really?");
            } else {
                print("Right");
            }
                
            print(factorial(12));
            
            sum-of-2and2 = {
                12 + 13;
                2 + 2 # can be without last semicolon
            };
        `));

        const tokens = [];
        let token = null;
        while (tokenizer.eof() == false) {
            token = tokenizer.next();
            tokens.push(token);
        }
        expect(JSON.stringify(tokens)).toBe(
            `[{"type":"Identifier","value":"print"},{"type":"Punctuation","value":"("},{"type":"String","value":"some text"},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":";"},{"type":"Identifier","value":"print"},{"type":"Punctuation","value":"("},{"type":"Number","value":3},{"type":"Operator","value":"<"},{"type":"Number","value":1},{"type":"Operator","value":"*"},{"type":"Number","value":2},{"type":"Operator","value":"/"},{"type":"Number","value":13},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":";"},{"type":"Identifier","value":"factorial"},{"type":"Operator","value":"="},{"type":"KeyWord","value":"f"},{"type":"Punctuation","value":"("},{"type":"Identifier","value":"x"},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":"{"},{"type":"KeyWord","value":"if"},{"type":"Identifier","value":"x"},{"type":"Operator","value":"<="},{"type":"Number","value":1},{"type":"KeyWord","value":"then"},{"type":"Number","value":1},{"type":"KeyWord","value":"else"},{"type":"Identifier","value":"n"},{"type":"Operator","value":"*"},{"type":"Identifier","value":"factorial"},{"type":"Punctuation","value":"("},{"type":"Identifier","value":"x"},{"type":"Operator","value":"-"},{"type":"Number","value":1},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":"}"},{"type":"Punctuation","value":";"},{"type":"KeyWord","value":"if"},{"type":"Punctuation","value":"("},{"type":"Number","value":1},{"type":"Operator","value":">"},{"type":"Number","value":2},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":"{"},{"type":"Identifier","value":"print"},{"type":"Punctuation","value":"("},{"type":"String","value":"Really?"},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":";"},{"type":"Punctuation","value":"}"},{"type":"KeyWord","value":"else"},{"type":"Punctuation","value":"{"},{"type":"Identifier","value":"print"},{"type":"Punctuation","value":"("},{"type":"String","value":"Right"},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":";"},{"type":"Punctuation","value":"}"},{"type":"Identifier","value":"print"},{"type":"Punctuation","value":"("},{"type":"Identifier","value":"factorial"},{"type":"Punctuation","value":"("},{"type":"Number","value":12},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":")"},{"type":"Punctuation","value":";"},{"type":"Identifier","value":"sum-of-2and2"},{"type":"Operator","value":"="},{"type":"Punctuation","value":"{"},{"type":"Number","value":12},{"type":"Operator","value":"+"},{"type":"Number","value":13},{"type":"Punctuation","value":";"},{"type":"Number","value":2},{"type":"Operator","value":"+"},{"type":"Number","value":2},{"type":"Punctuation","value":"}"},{"type":"Punctuation","value":";"}]`
        );
    });
});
