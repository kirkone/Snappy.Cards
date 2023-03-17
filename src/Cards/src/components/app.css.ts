import { createVar, fallbackVar, style } from "@vanilla-extract/css";

import { varsApp } from "../theme/variables.css";

export const CssVarBackground = createVar();

export const app = style({
    height: "100%",
    width: "100vw",

    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",

    backgroundImage: `
        ${fallbackVar(CssVarBackground, "none")},
        -webkit-radial-gradient(
            top,
            ${varsApp.color.dark.tint},
            ${varsApp.color.light.shade}
        )
    `,

    overflowY: "auto",
    // otherwise scrollbar would make content jump
    overflowX: "hidden",
    minWidth: "30rem"
});
