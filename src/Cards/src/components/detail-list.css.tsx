import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const detail = style({
    // for dark / light mode switching
    transition: "color 1s",

    color: varsApp.color.text.hex,
});

export const detailLine = style({
    // control text overflow
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",

    lineHeight: 2,
});

export const detailIcon = style({
    verticalAlign: "-17%",
    marginRight: "0.5em",
});
