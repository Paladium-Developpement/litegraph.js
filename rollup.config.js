import commonjs from "@rollup/plugin-commonjs";
import noderesolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default [
    {
        input: "src/index.js",
        output: {
            file: "build/litegraph.min.js",
            format: "iife",
            sourcemap: true,
            name: "LiteGraph"
        },
        plugins: [
            commonjs(),
            noderesolve(),
            babel({
                exclude: ["node_modules/**"],
            }),
            terser(),
        ],
    },
    {
        input: "src/index.js",
        output: {
            file: "build/litegraph.js",
            format: "umd",
            name: "LiteGraph",
            sourcemap: true,
        },
        plugins: [
            commonjs(),
            noderesolve(),
            babel({
                exclude: ["node_modules/**"],
            }),
        ],
    },
    {
        input: "src/index.js",
        output: [
            { file: "build/litegraph.cjs.js", format: "cjs" },
            { file: "build/litegraph.esm.js", format: "es" },
        ],
        plugins: [],
    },
];
