import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const directory = './src/components';
const files = fs.readdirSync(directory);

let input = {};

const buildTarget = process.env.VITE_BUILD_TARGET || files[0];

console.log(`Building ${buildTarget}`);

if (!files.includes(buildTarget)) {
  throw new Error(`There is not folder named: ${buildTarget} in src/components`);
}

files.forEach((file) => {
  // remove the file extension
  const name = path.parse(file).name;
  // assign the file path to the name key in the input object
  input[name] = path.resolve(__dirname, directory, file);
});

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        [buildTarget]: input[buildTarget],
      },
    },
  },

  plugins: [
    cssInjectedByJsPlugin({
      relativeCSSInjection: true,
      useStrictCSP: true,
    }),
  ],
});
