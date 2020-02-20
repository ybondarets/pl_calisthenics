# Tokenizer

Tokenizer is a class operates on a InputStream and return 
tokens list. Nice to implement it with the same
interface like in InputStream.

So let's create files and start from test:
`__tests__/tokenizer/Tokenizer.test.ts`

```typescript
import InputStream from "../../src/input/InputStream";
import Tokenizer from "../../src/tokenizer/Tokenizer";

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
});
```

And now we need to implement constructor for tokenizer

`src/tokenizer/Tokenizer.ts`: 
```typescript
import InputStream from "../input/InputStream";

export default class Tokenizer {
    private input: InputStream;

    public constructor(input: InputStream) {
        this.input = input;
    }
}
```

As you can see we a using InputStream as argument of the tokenizer.
In general case will be better to pass some interface instead of 
concrete class, but in current case I will avoid this practice 
to make implementation as easy as possible. Of course, after basic implementation
i'm planning to make some refactoring to have hone for my eyes)).

On of the most important things is parse only known code 
and don't try to guess, if you can't parse something just throw error
with enough information.

As we remember from InputStream we need to implement
list of methods:
* `current` - will return current token
* `next` - will move cursor to the next position and return current token
* `eof` - will return `true` if we have no more tokens
* `reset` - reset input stream to be available read tokens again 

I think we can start from `current` method.
We can write simple test case and improve it in a process of development
`__tests__/tokenizer/Tokenizer.test.ts`:

```typescript
    it('current test', () => {
        const tokenizer = createTokenizer(createInput());
        expect(tokenizer.current()).toBe(null);
    });
```

Here we are should get `null` if receive empty input (or input is ends).

`src/tokenizer/Tokenizer.ts`:
```diff
import InputStream from "../input/InputStream";

export default class Tokenizer {
    private input: InputStream;
+    private currentToken: any = null;

    public constructor(input: InputStream) {
        this.input = input;
    }

+    public current(): null|any {
+        if (this.currentToken === null) {
+            this.currentToken = this.readNext();
+        }
+
+        return this.currentToken;
+    }
}
```

As you can see, we create new property `currentToken` to be available
return same token for each `current` call. If `currentToken` is not defined
we will read next token by `readNext` method. We need to implement it, it will be 
a soul of our tokenizer. We write test case only for empty input so we need
to implement only that behaviour.

```typescript
    private readNext(): any {
        if (this.input.eof()) return null;

        this.input.error(`Can't handle character ${this.input.current()}`);
    }
```

Looks really easy, is not it. I propose moving from simple to complex.
Next test case will be for input only from whitespaces
`__tests__/tokenizer/Tokenizer.test.ts`:

```typescript
    it('whitespaces input',  () => {
        const tokenizer = createTokenizer(createInput(`   
              
            
        `));
        expect(tokenizer.current()).toBe(null);
    });
```

To ensure this behavior we need to ignore all whitespaces
`src/tokenizer/Tokenizer.ts`:

```typescript
        private readNext(): any {
            this.readUntil(this.isWhitespace);
            if (this.input.eof()) return null;
    
            this.input.error(`Can't handle character ${this.input.current()}`);
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
```

Here we create new methods, first is `readUntil` and it will read
characters from the input while input is not end and
criteria returns true and accumulate chars to the "word".

And `isWhiteSpace` is a criteria that will check is the character is a whitespace.

Next one is ignoring comments, and testcase for it:

```typescript
    it('comments input',  () => {
        const tokenizer = createTokenizer(createInput(`   
              # some comment
        #`));
        expect(tokenizer.current()).toBe(null);
    });
```

We need to ignore all characters ont the line after `#` symbol
`src/tokenizer/Tokenizer.ts`:

```diff
    private readNext(): any {
        this.readUntil(this.isWhitespace);
        if (this.input.eof()) return null;
-       this.input.error(`Can't handle character ${this.input.current()}`);

+        const symbol = this.input.current();
+
+        switch (true) {
+            case this.isCommentStart(symbol):
+                this.nextLine();
+                return this.readNext();
+            default:
+                this.input.error(`Can't handle character ${this.input.current()}`);
+        }
    }

+    private nextLine(): void {
+        this.readUntil((symbol: string) => symbol !== '\n');
+    }
+
+    private isCommentStart(symbol: string): boolean {
+        return symbol === '#';
+    }
```

Here we change `readNext` little bit by adding `switch` construction.
In cases we will check some criteria and do some stuff according this. 

Now i want to implement string reading, and it's means then we finally
will return some kind of token. We need to create `Token` class before return it.
`src/tokenizer/Token.ts`:
```typescript
import TokenType from "./TokenType";

export default class Token {
    private type: TokenType;
    private value: any;

    public constructor(type: TokenType, value: any) {
        this.validateType(type);
        this.type = type;
        this.value = value;
    }

    public getType(): TokenType {
        return this.type;
    }

    public getValue(): any {
        return this.value;
    }

    private validateType(type: TokenType) {
        if (!(type in TokenType)) {
            throw new Error('Token type should be one of "TokenType"');
        }
    }
}
```

`src/tokenizer/TokenType.ts`:
```typescript
enum TokenType {
    String = "String"
}

export default TokenType;
``` 

Here we declare enum `TokenType`, we will enumerate token types in them,
and `Token` class which should store type and value of the token.
Of course we need to test this class
`__tests__/tokenizer/Tokenizer.test.ts`:

```typescript
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
```

After implementing `Token` we can return to the `Tokenizer` and implement
parsing string tokens. As usual create tests first
`__tests__/tokenizer/Tokenizer.test.ts`:

```typescript
    it('string literal test', () => {
        const tokenizer = createTokenizer(createInput(`   
              # some comment
              "and string literal with \n escaped character inside. and for and f"
        `));

        const token = tokenizer.current();

        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.String);
        expect((token as Token).getValue()).toBe("and string literal with \n escaped character inside.. and for and f");
    });
```

As you see, i'm planning to support escaped symbols i the strings.
We need to add new case to the `readNext` method
`src/tokenizer/Token.ts`:

```typescript
case this.isStringStart(symbol):
   return this.readString();
```

and implement methods `isStringStart`:

```typescript
private isStringStart(symbol: string): boolean {
    return symbol === '"';
}
```

and `readString`:

```typescript
private readString(): Token {
    return new Token(TokenType.String, this.readStringContent());
}
```

Here we create new `Token` with `TokenType.String` type and value returned by
`readStringContent` method. It will read string while string or input is not ended.
So, let's implement this method:

```typescript
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
```

Next type of tokens that we can read will be numbers
`src/tokenizer/TokenType.ts`:
```diff
enum TokenType {
    String = "String",
+   Number = "Number"
}

export default TokenType;
```


To check correctness create test case:
```typescript
    it('parse number test', () => {
        const tokenizer = createTokenizer(createInput(`
              1234.1234
        `));

        const token = tokenizer.current();

        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Number);
        expect((token as Token).getValue()).toBe(1234.1234);
    });
``` 

And add case to the `readNext` method:

```typescript
case this.isNumber(symbol):
    return this.readNumber();
```

and implement method `isNumber`: 
```typescript
    private isNumber(symbol: string): boolean {
        return /\d/.test(symbol);
    }
```

and not so easy method `readNumber`:

```typescript
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
```

Now we can skip comments, read strings and numbers. Not so much stuff left to implement.
We need to identify identifiers, keywords, punctuation symbols and operators.

Before continue with parsing we need to implement method `next` of the `Tokenizer`,
it will allow to better test our class.
`__tests__/tokenizer/Tokenizer.test.ts`:
```typescript
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
```
According to the test case, the `next` function sometimes will return current token,
it's useful to create iterator.

And look at implementation `src/tokenizer/Tokenizer.ts`:
```typescript
    public next(): Token|null {
        const current = this.current();
        this.currentToken = null;

        return current || this.readNext();
    }
```



Identifiers and keywords are pretty same we can start to parse them in one condition.
As usual we will start from test case:
```typescript
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
```

Here is described usual program with `if` statement and identifiers.
Add new token types to the `src/tokenizer/TokenType.ts`:
```diff
enum TokenType {
    String = "String",
    Number = "Number",
+    KeyWord = "KeyWord",
+    Identifier = "Identifier"
}

export default TokenType;
```

Now we can start to update `readNext` method of the `Tokenizer` by adding new 
condition to the switch statement:
```typescript
case this.isIdentifierStart(symbol):
    return this.readIdentifier();
```

First `isIdentifierStart` method should be implemented:

```typescript
private isIdentifierStart(symbol: string): boolean {
    return /[a-z_]/i.test(ch);
}
```
Our identifiers can start from `_` symbol or any letter.
When we detect than identifier is started we can read it by `readIdentifier` method:

```typescript
private readIdentifier(): Token {
    const value = this.readUntil((symbol: string): boolean => {
        return this.isIdentifier(symbol);
    });

    const type = this.isKeyWord(value) ?
        TokenType.KeyWord :
        TokenType.Identifier;

    return new Token(type, value);
}
```

Here we are reading string while character is available in identifier name,
to check it implement `isIdentifier` method:

```typescript
private isIdentifier(symbol: string): boolean {
    return this.isIdentifierStart(symbol) || "0123456789-><=!?".indexOf(symbol) >= 0;
}
```
We can use numbers and some "operators" as part of identifier, it can be useful
to declare identifiers like `a<b = a < b`.

And last one of this block is `isKeyWord` method, we need to describe list of out key words
and check it here. I think we need to create new enum with keywords.
Create file `src/syntax/KeyWord.ts`, and test `__tests__/syntax/KeyWord.test.ts`:
```typescript
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
```
And implement `src/syntax/KeyWord.ts`:
```typescript
enum KeyWord {
    if = "if",
    else = "else",
    then = "then",
    f = "f",
    true = "true",
    false = "false"
}

const isKeyWord = (word: string): boolean => {
    return word in KeyWord;
};

export { isKeyWord };

export default KeyWord;
```

Now we can return to the key word detection in our `Tokenizer`,
create method `isKeyWord`:
```typescript
    private isKeyWord(word: string): boolean {
        return isKeyWord(word);
    }
```

And add import statement:
```typescript
import {isKeyWord} from "../syntax/KeyWord";
```

And now you should get successful tests result.

Now we can detect punctuation symbols, it can be one from a list `,;(){}[]`
Create test `__tests__/syntax/Punctuation.test.ts`:
```typescript
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
```

As you can notice we need to create `src/syntax/Punctuation.ts` file:
```typescript
enum Punctuation {
    comma = ",",
    semicolon = ";",
    openingParenthesis = "(",
    closingParenthesis = ")",
    openingBrace = "{",
    closingBrace = "}",
    openingBracket = "[",
    closingBracket = "]"
}

const isPunctuation = (symbol: string): boolean => {
    return Object.values(Punctuation).indexOf(symbol as Punctuation) >= 0;
};

export { isPunctuation };

export default Punctuation;
```

According to following test case `__tests__/tokenizer/Tokenizer.test.ts`:
```typescript
    it('parse punctuation', () => {
        const tokenizer = createTokenizer(createInput(`
              hi();
        `));
        tokenizer.next();
        let token = tokenizer.next();

        expect(token).toBeInstanceOf(Token);
        expect((token as Token).getType()).toBe(TokenType.Punctuation);
        expect((token as Token).getValue()).toBe('(');
    });
```

we need to add new token type to the `src/tokenizer/TokenType.ts`:
```diff
enum TokenType {
    String = "String",
    Number = "Number",
    KeyWord = "KeyWord",
    Identifier = "Identifier",
+   Punctuation = "Punctuation"
}

export default TokenType;
```

Now it's pretty easy to implement punctuation separation in `src/tokenizer/Tokenizer.ts`:
Add case to the switch block of the `readNext` method
```typescript
case this.isPunctuation(symbol):
    return this.readPunctuation();
```
add import statement 
```typescript
import {isPunctuation} from "../syntax/Punctuation";
```

and implement methods `isPunctuation` and `readPunctuation`:

```typescript
    private isPunctuation(symbol: string): boolean {
        return isPunctuation(symbol);
    }

    private readPunctuation(): Token {
        return new Token(TokenType.Punctuation, this.input.current());
    }
```

Now only one parsing entity left - operators. As usually create test and function
to detect operators `__tests__/syntax/Operator.test.ts`:

```typescript
import Operator, { isOperator } from "../../src/syntax/Operator";

describe('Operator test', () => {
    it('not Operator test', () => {
        expect(isOperator('abra')).toBe(false);
    });

    it('is Operator test', () => {
        expect(isOperator("*")).toBe(true);
        expect(isOperator("/")).toBe(true);
        expect(isOperator("^")).toBe(true);
        expect(isOperator("<")).toBe(true);
        expect(isOperator(">")).toBe(true);
        expect(isOperator("=")).toBe(true);
        expect(isOperator("+")).toBe(true);
        expect(isOperator("-")).toBe(true);
        expect(isOperator("&")).toBe(true);
        expect(isOperator("|")).toBe(true);
        expect(isOperator("!")).toBe(true);
        expect(isOperator("%")).toBe(true);
        expect(isOperator(Operator.divide)).toBe(true);
    });
});
```

And `src/syntax/Operator.ts` implementation:
```typescript
enum Operator {
    multiple = "*",
    divide = "/",
    power = "^",
    less = "<",
    more = ">",
    assign = "=",
    plus = "+",
    minus = "-",
    and = "&",
    or = "|",
    not = "!",
    modulus = "%"
}


const isOperator = (symbol: string): boolean => {
    return Object.values(Operator).indexOf(symbol as Operator) >= 0;
};

export { isOperator };

export default Operator;
```

Now i want to create test case to parse operators `__tests__/tokenizer/Tokenizer.test.ts`:
```typescript
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
```

Add new `TokenType`:
```typescript
    Operator = "Operator"
```
Now I will add new one case to the `switch` construction
in the `readNext` method:
```typescript
case this.isOperator(symbol):
    return this.readOperator();
```
Add `import {isOperator} from "../syntax/Operator";` to the head of `Tokenizer`
and implement needed methods:

```typescript
private isOperator(symbol: string): boolean {
    return isOperator(symbol);
}

private readOperator(): Token {
    const value = this.readUntil(isOperator);

    return new Token(TokenType.Operator, value);
}
```

Pay attention on the `readUntil` usage, we need to read characters until
it can be a operator, because operator can contains more then 1 symbol.

On it out tokenizer almost done, left only 2 methods:
* `eof`
* `reset`

Let's do it in the same time because they are really simple:
`__tests__/tokenizer/Tokenizer.test.ts`:
```typescript
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
```

And implementation:
```typescript
    public reset(): void {
        this.input.reset();
        this.currentToken = undefined;
    }

    public eof(): boolean {
        return this.current() === null;
    }
```

To check whole process we can create test case with
input from syntax description part:
```typescript
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
```

Looks like everything is working and here is the final `Tokenizer`:

```typescript
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
```

Next step will be AST description. We need to plan how our 
code representation will look to handle it in easiest way.

[Next part](./2_4_AST_description.md)
