const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const postcss = require("rollup-plugin-postcss");
const typescript = require("@rollup/plugin-typescript");
const sucrase = require("@rollup/plugin-sucrase");
const replace = require("@rollup/plugin-replace");

module.exports = {
  input: "src/index.ts", // Entry point for your library
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true, // Enable source maps for debugging
  },
  plugins: [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json", // Point to your TypeScript config
    }),
    postcss({
      config: {
        path: "./postcss.config.cjs",
      },
      extensions: [".scss"],
      minimize: true,
      extract: "styles/editor.css",
      syntax: require("postcss-scss"),
    }),
    replace({
      // Replace SCSS imports with CSS imports in the final JS output
      preventAssignment: true,
      delimiters: ["", ""],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      values: {
        "../styles/editor.scss": "../styles/editor.css",
      },
    }),
    sucrase({
      exclude: ["node_modules/**"],
      transforms: ["typescript", "jsx"],
    }),
  ],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime", // Mark as external
    /\.css$/,
  ],
};
