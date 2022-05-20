import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import cleaner from "rollup-plugin-cleaner";
import commonjs from "@rollup/plugin-commonjs";
import packageJson from "./package.json";
import multiInput from "rollup-plugin-multi-input";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      cleaner({
        targets: ["./lib"],
      }),
      peerDepsExternal(),
      // resolve(),
      commonjs(),

      typescript({
        tsconfigOverride: {
          exclude: ["cli/**/*", "**/*.stories.tsx", "**/*.test.tsx"],
        },
      }),
    ],
  },
];

