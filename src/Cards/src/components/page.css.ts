import { createVar, style } from "@vanilla-extract/css";

import { varsApp } from "../theme/variables.css";

export const CssVarAlignment = createVar();

export const page = style({
    height: "100vh",

    position: "sticky",
    top: 0,

    display: "flex",
    alignItems: CssVarAlignment,

    maxWidth: "52rem",
    minWidth: "20rem",
    margin: "0 auto",
    padding: `0 ${varsApp.space.large}`,
});
