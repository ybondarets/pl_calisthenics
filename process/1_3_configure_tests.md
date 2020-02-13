# Configure tests

I want to develop it according to TDD.
So need to configure some king of testing engine.
I like to use `Jest`.
To install it run
```bash
npm install --save-dev jest ts-jest @types/jest
```

And update `scripts` section in `package.json`
```diff
  "scripts": {
-    "test": "echo \"Error: no test specified\" && exit 1",
+    "test": "jest",
+    "test-coverage": "jest --coverage",
    "build": "webpack",
    "start": "webpack-dev-server",
    "test": "jest"
  },
```

After it add we can configure jest by command
```bash
npx ts-jest config:init
```
It will generate `jest.config.js` file at the root of your project

We don't need to commit tests coverage data, so add it to the `.gitignore`
```js
coverage
```

Now we can test our tests)).
In `src` directory create file like `hi.ts` with content:
```ts
export default (a: number): number => {
    return 2 * a;
};
```

Create directory {PROJECT_ROOT}/__tests__
and file inside like `fist.test.ts`
```ts
import hi from '../src/hi';

it('first test', () => {
    expect(hi(0.5)).toEqual(1);
    expect(hi(2)).toEqual(4);
});
```

And run `npm run test` or `npm run test-coverage`

As everything is working okay, we can remove temporary testing files
and go ahead.  

Have a nice day, and see you.
