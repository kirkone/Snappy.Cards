import { createVar, fallbackVar, style } from "@vanilla-extract/css";

import { varsApp } from "../theme/variables.css";

export const CssVarBackground = createVar();

export const app = style({
    height: "100vh",
    width: "100vw",

    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",

    backgroundImage: `
        ${fallbackVar(CssVarBackground, "none")},
        -webkit-radial-gradient(
            top,
            ${varsApp.color.light.shade},
            ${varsApp.color.dark.tint}
        )
    `,

    overflowY: "auto",
});
