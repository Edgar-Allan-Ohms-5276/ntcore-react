import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from "rollup-plugin-dts";

const externals = ['react', 'react/jsx-runtime', '@2702rebels/ntcore']

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.min.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [typescript(), terser()],
        external: externals
    },
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.d.ts",
            format: "es",
        },
        plugins: [dts()],
        external: externals
    }
]