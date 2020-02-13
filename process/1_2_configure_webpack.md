# Webpack configuration

As i planing to write on TypeScript and don't want to use IDE build-in tsc
i need to configure webpack to do this stuff. Also, it has a lot of advantages
like same configuration on each machine according to `tsconfig.file`.

So, let's start from official guide at https://webpack.js.org/guides/getting-started/

First of all we need to install webpack by command
`npm install webpack@^4.41.6 webpack-cli@^3.3.11 --save-dev`

After doing it npm will generate `package-lock.json` file at the root
of your project, we need to commit it to assure same packages versions 
on the each developers machine.

I don't need to commit `node_modules` directory, so i will add
`node_modules` to the `.gitignore` file, now it looks like:
```
.idea
node_modules
```

Than create files 
```diff
project_root
  |- package.json
+ |- /dist
+   |- index.html
+ |- /src
+   |- app.js
```

src/app.js

```javascript
(() => {
    console.log('Exec.');
})();
```

dist/index.html

```html
<!doctype html>
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <script src="./src/app.js"></script>
    </body>
</html>
```
Now you can run `npx webpack` and open `dist/index.html` in a browser to see console output.

Usually we don't need to commit files from `dist` directory because it's
ready to use files and can be unique for each developer, so add `dist` to the 
end of `.gitignore` file.

To better configure webpack we can create config file.
Add `webpack.config.js` to the project root and add next lines
```javascript
const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
``` 

For now it's doing nothing because it's some kind
of default webpack configuration.
But you can run webpack with following configuration
by `npx webpack --config webpack.config.js`

To simplify script running we can add it to
the `package.json` `scripts` section.
Now it will be like
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
```
and you can run webpack via `npm run build`.

As we don't want to commit `dist` directory content 
we should remove `dist/index.html` file but keep
possibility to generate `html` file with results
we can install `HtmlWebpackPlugin` via
`npm install --save-dev html-webpack-plugin`

Now we need to configure it in `webpack.config.js`
```diff
const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
+    plugins: [
+        new HtmlWebpackPlugin({
+            title: 'html output',
+        }),
+    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
```

Also i want to configure webpack output,
it will give me possibility to processed
caching better and use same code for different platforms.
I will start to configure output like for multiple
entry-points (even it's single now)

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
-    entry: './src/app.js',
+    entry: {
+        app: './src/app.js',
+    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'html output',
        }),
    ],
    output: {
-        filename: 'main.js',
+        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
};

``` 

As you can see, now we are using 
`[contenthash]` like a part of result file name.
It can be a problem in a time because it will
generate file names according ro the content,
so `dist` folder can emit a lot
of builds like
 * app.hash1.js
 * app.hash2.js
 * ...
 * app.oher_hash.js  

To prevent this problem we can clear dist folder
in case of successful build. `CleanWebpackPlugin` can help with it.
To install run `npm install --save-dev clean-webpack-plugin`,
than add
```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
```
 to the imports section in `webpack.config.js` and
```javascript
new CleanWebpackPlugin()
```
to the plugins.

Webpack can watch on your files and compile them.
It's very useful, to do it we can add use `webpack-dev-server`:

```
npm install --save-dev webpack-dev-server@^3.7.1
```

and add script to the `package.json` file
```diff
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
+    "start": "webpack-dev-server"
  },
```
We also need to modify `webpack.config.js` file:
```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'html output',
        }),
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
+    devServer: {
+        contentBase: path.resolve(__dirname, "dist"),
+        historyApiFallback: true,
+        compress: true,
+        port: 8080,
+        watchContentBase: true
+    },
};

```

Now, after running `npm run start` webpack
will start server and watch on your files.

## Configuring TypeScript

First of all let's install typescript by:
```bash
npm install --save-dev typescript ts-node @types/node @types/webpack ts-loader
```
As we using `webpack-dev-server` we also need to
install one more tool:
```bash
npm install --save-dev @types/webpack-dev-server
```

Now need to create `tsconfig.json` at the root 
of project the to configure TypeScript compiler:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "esModuleInterop": true,
    "sourceMap": true
  }
}
```
Rename `src/app.js` to `src/app.ts`

Now we can replace `webpack.config.js` by `webpack.config.ts`

```ts
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const config: webpack.Configuration = {
    entry: {
        app: './src/app.ts',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'html output',
        }),
    ],
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        historyApiFallback: true,
        compress: true,
        port: 8080,
        watchContentBase: true
    },
};

export default config;
```

Basically that's it for webpack configuration. In a process of development it can be
changed, but it's enough for now.

At the next step we will configure testing engine
to be available to work according to TDD. 
