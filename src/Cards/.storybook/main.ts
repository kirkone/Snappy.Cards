import { dirname, join } from "path";

import type { StorybookConfig } from '@storybook/preact-vite';

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
    return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
    stories: [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@chromatic-com/storybook'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/preact-vite'),
        options: {}
    },
    docs: {
        autodocs: "tag",
    },
    core: {
        disableTelemetry: true
    }
};
export default config;
