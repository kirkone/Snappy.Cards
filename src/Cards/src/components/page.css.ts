import { createVar, globalStyle, style } from "@vanilla-extract/css";

import { varsApp } from "../theme/variables.css";

export const CssVarAlignment = createVar();

export const page = style({
    // height: CssVarFit,
    display: "flex",
    alignItems: CssVarAlignment,
    justifyContent: "center",

    width: "100%",
    height: "100%",
    minWidth: "20rem",
    margin: "0 auto",
    padding: `0 ${varsApp.space.large}`,

    // click through page
    pointerEvents: "none",

    scrollSnapAlign: "center",
    scrollSnapStop: "always",
});

globalStyle(`${page} > *`, {
    pointerEvents: "auto",
});
