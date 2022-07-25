// import path from 'path';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import svgo from 'rollup-plugin-svgo';
import json from '@rollup/plugin-json';

export const plugins = [
    json(),
    resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        // jail: path.join(process.cwd(), 'src'),
        resolveOnly: [/is-online/, /public-ip/],
        preferBuiltins: true,
    }),
    commonjs(),
    babel({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        exclude: 'node_modules/**',
        rootMode: 'upward',
        babelHelpers: 'runtime',
    }),
];

export default [
    {
        input: 'src/index.js',
        output: {
            file: 'index.js',
            format: 'cjs'
        },
        plugins,
    },
    {
        input: 'src/cli.js',
        output: {
            file: 'cli.js',
            format: 'cjs',
            banner: '#!/usr/bin/env node'
        },
        plugins,
    }
];
