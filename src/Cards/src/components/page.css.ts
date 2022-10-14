import { createVar, globalStyle, style } from "@vanilla-extract/css";

export const CssVarAlignment = createVar();

export const page = style({
    height: "100vh",

    position: "sticky",
    top: 0,

    display: "flex",
    alignItems: CssVarAlignment,

    maxWidth: "50rem",
    minWidth: "20rem",
    margin: "0 auto"
});

globalStyle(`${page} > *`, {
    flex: 1,
});
