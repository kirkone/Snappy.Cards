import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const container = style({
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
});

export const footer = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export const textColor = style({
    color: varsApp.color.dark.hex,
});
