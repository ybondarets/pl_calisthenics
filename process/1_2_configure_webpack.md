# Webpack configuration

As i planing to write on TypeScript and don't want to use IDE build-in tsc
i need to configure webpack to do this stuff. Also, it has a lot of advantages
like same configuration on each machine according to `tsconfig.file`.

So, let's start from official guide at https://webpack.js.org/guides/getting-started/

First of all we need to install webpack by command
`npm install webpack webpack-cli --save-dev`

After doing it npm will generate `package-lock.json` file at the root
of your project, we need to commit it to assure same packages versions 
on the each developers machine.

I don't need to commit `node_modules` directory, so i will add
`node_modules` to the `.gitignore` file, now it looks like:
```
.idea
node_modules
```
