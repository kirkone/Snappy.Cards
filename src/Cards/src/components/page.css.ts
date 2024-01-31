import { createVar, globalStyle, style } from "@vanilla-extract/css";

import { varsApp } from "../theme/variables.css";

export const CssVarAlignment = createVar();
export const CssVarFit = createVar();

export const page = style({
    height: CssVarFit,

    position: "sticky",
    top: 0,

    display: "flex",
    alignItems: CssVarAlignment,

    maxWidth: "52rem",
    minWidth: "20rem",
    margin: "0 auto",
    padding: `0 ${varsApp.space.large}`,

    // click through page
    pointerEvents: "none"
});

globalStyle(`${page} > *`, {
    pointerEvents: "auto"
});
