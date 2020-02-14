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
+    private currentToken: any;

    public constructor(input: InputStream) {
        this.input = input;
    }

+    public current(): null {
+        if (!this.currentToken) {
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
            return this.input.eof() === false && criteria(this.input.current()) ?
                this.input.next() + this.readUntil(criteria) :
                '';
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
+        this.input.next();
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
        let result = '';
        this.input.next();

        while (this.input.eof() === false && !this.isStringStart(this.input.current())) {
            result += this.input.current();
            this.input.next();
        }

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
```
