import { keyframes, style } from "@vanilla-extract/css";

import { varsApp } from "../theme/variables.css";

const fadeIn = keyframes({
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
});

export const qrCode = style({
    borderRadius: varsApp.space.small,

    animation: `${fadeIn} 1s`,
    backgroundColor: `rgb(${varsApp.color.light.rgb},.75)`,
    color: varsApp.color.dark.hex,
    transition: "background 1s, color 1s",

    selectors: {
        "&:hover": {
            backgroundColor: varsApp.color.light.hex,
        }
    }
});
