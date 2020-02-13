# First class

Everybody want to write code as early as possible.))
So, we can keep language syntax description for the future
and start programming. Anyway we need some class to
processed input. Basically it will read source-codes
by symbol and pass to other layer.
I will call it `InputStream`. First of all create
file `src/input/InputStream.ts`:
```typescript
export default class InputStream {

}
```

and text file

`__tests__/input/InputStream.test.ts` with content
```typescript
import InputStream from "../../src/input/InputStream";

const inputText = `
#include <iostream>
#include <cmath>
using namespace std;
int main() {
    float a, b, c, x1, x2, discriminant, realPart, imaginaryPart;
    cout << "Enter coefficients a, b and c: ";
    cin >> a >> b >> c;
    discriminant = b*b - 4*a*c;
    
    if (discriminant > 0) {
        x1 = (-b + sqrt(discriminant)) / (2*a);
        x2 = (-b - sqrt(discriminant)) / (2*a);
        cout << "Roots are real and different." << endl;
        cout << "x1 = " << x1 << endl;
        cout << "x2 = " << x2 << endl;
    }
    
    else if (discriminant == 0) {
        cout << "Roots are real and same." << endl;
        x1 = (-b + sqrt(discriminant)) / (2*a);
        cout << "x1 = x2 =" << x1 << endl;
    }
    else {
        realPart = -b/(2*a);
        imaginaryPart =sqrt(-discriminant)/(2*a);
        cout << "Roots are complex and different."  << endl;
        cout << "x1 = " << realPart << "+" << imaginaryPart << "i" << endl;
        cout << "x2 = " << realPart << "-" << imaginaryPart << "i" << endl;
    }
    return 0;
}
`;

describe('InputStream test', () => {
    it('create test', () => {
        const input = new InputStream();
        expect(input).toBeInstanceOf(InputStream);
    });
});
```

Now i want to implement passing data to the input stream via constructor `src/input/InputStream.ts`:

```diff
export default class InputStream {
+    private source: string;
+
+    public constructor(source: string = '') {
+        this.source = source;
+    }
}
```

This property will be encapsulated, so i will not create test for it.

Basically we need a list of methods:

* `current` - will return current symbol
* `next` - will move cursor to the next position and return next symbol
* `eof` - will return `true` if we have no more symbols
* `error` - will throw error with current cursor position to easy find syntax errors
* `reset` - reset cursor to be available read stream again

Create test for `current` method, just add to the `__tests__/input/InputStream.test.ts:42` next code:

```typescript
    it('current test', () => {
        const input = new InputStream(inputText);
        expect(input.current()).toEqual('\n');
    });
```

But it will be failed, so we need to implement this method
in `src/input/InputStream.ts`:

```diff
export default class InputStream {
    private source: string;
+   private position: number = 0;

    public constructor(source: string = '') {
        this.source = source;
    }

+    public current(): string {
+        return this.source.charAt(this.position);
+    }
}
```

Looks like it works.

Okay, i think next one should be `next`:
So add test-case for it and refactor test suite little bit:
```typescript
describe('InputStream test', () => {
    const createInput = (): InputStream => {
        return new InputStream(inputText);
    };

    it('create test', () => {
        const input = createInput();
        expect(input).toBeInstanceOf(InputStream);
    });

    it('current test', () => {
        const input = createInput();
        expect(input.current()).toEqual('\n');
    });

    it('next test', () => {
        const input = createInput();
        expect(input.next()).toEqual('#');
    });
});
```

and implement method `next` method in `src/input/InputStream.ts`:
```typescript
    public next(): string {
        this.position++;

        return this.current();
    }
```

Next one will be `eof`, text for it:
```typescript
    it('eof test', () => {
        const input = new InputStream('two');
        expect(input.eof()).toBe(false);
        input.next();
        input.next();
        input.next();
        expect(input.eof()).toBe(true);
    });
```

and simple implementation:

```typescript
    public eof(): boolean {
        return this.current() === '';
    }
```

Now should be one of the hardest one - `error` with test case:
```typescript
    it('throw test', () => {
        const input = createInput();
        input.next();
        input.next();
        input.next();
        expect(() => { input.error('Error'); }).toThrowError('Error at 1:3');
    });
```

To implement it we need to know somehow on which row and col is our cursor.
So we need to implement it by changing couple of methods `src/input/InputStream.ts`:

```diff
export default class InputStream {
    private source: string;
    private position: number = 0;
+    private column: number = 0;
+    private line: number = 1;

    public constructor(source: string = '') {
        this.source = source;
    }

    public current(): string {
        return this.source.charAt(this.position);
    }

    public next(): string {
        this.position++;
-        return this.current();
+        const symbol = this.current();
+
+        if (symbol === '\n') {
+            this.line++;
+            this.column = 0;
+        } else {
+            this.column++;
+        }
+
+        return symbol;
    }

    public eof(): boolean {
        return this.current() === '';
    }

+    public error(message: string = ''): void {
+        throw new Error(`${message} at ${this.line}:${this.column}`);
+    }
}
```

As you can see here we create new variables called `line` and `column` to
know actual cursor position. Input stream update it in the `next` method and use
in `error` method.

Last method that needs to be implemented is a `reset`. It's really easy,
just look at the test:

```typescript
    it('reset test', () => {
        const input = createInput();
        input.next();
        input.next();
        input.next();
        input.next();
        input.next();
        input.reset();
        expect(input.current()).toBe('\n');
    });
```

and implementation is pretty easy:

```typescript
    public reset(): void {
        this.position = 0;
        this.column = 0;
        this.line = 1;
    }
```

It's all about this class. I think then we can continue in the
next time. It will be small language syntax description.
