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

    overflow: "auto",
    minWidth: "30rem",

    scrollSnapType: "both mandatory",
    scrollBehavior: "smooth",

    display: "flex",
    flexWrap: "wrap",
    // horizontal on mobile ...
    flexDirection: "row",
    gap: "10rem",

    "@media": {
        "(hover: none)": {
            // ...and vertical on desktop
            flexDirection: "column"
        }
    }
});
