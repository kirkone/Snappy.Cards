import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        preact(),
        vanillaExtractPlugin(),
    ],
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
});
