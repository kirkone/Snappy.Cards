import { defineConfig, splitVendorChunkPlugin } from "vite";

import hypothetical from "rollup-plugin-hypothetical";
import { imagetools } from 'vite-imagetools';
import preact from '@preact/preset-vite';
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        preact(),
        imagetools({
            defaultDirectives: () => new URLSearchParams({
                effort: mode === "production" ? "max" : "min"
            })
        }),
        vanillaExtractPlugin(),
        splitVendorChunkPlugin(),
        hypothetical({
            allowFallthrough: true,
            files: {
                "../../node_modules/monocle-ts/es6/index.js": `
                    export const At = {};
                    export const Iso = {};
                    export const Ix = {};
                    export const Lens = {
                        fromProp(){},
                        fromProps(){},
                        fromPath(){},
                    };
                    export const Optional = {
                        fromOptionProp(){},
                        fromNullableProp(){},
                    };
                    export const Prism = {
                        some(){},
                        fromPredicate(){},
                    };
                    export const Traversal = {};
                    export const Index = {
                        fromAt(){},
                    };
                `,

                "../../node_modules/filenamify/filenamify-path.js": `
                    export default function filenamifyPath(filePath, options) {}
                `
            }
        }),
        mode === "production" && visualizer({
            filename: "build/stats.html"
        }),
    ],
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    build: {
        outDir: "../../build",
        emptyOutDir: true,
        minify: "terser",
    }
}));
