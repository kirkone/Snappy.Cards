import "../src/styles/base.css";
import "../src/styles/reset.css";

import * as theme from "../src/theme/variables.css";

import type { Preview } from '@storybook/preact';
import { h } from "preact";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    tags: [
        "autodocs"
    ],
    decorators: [
        (Story) => (
            h("div", { className: theme.defaultTheme }, Story())
        ),
    ]
};

export default preview;
