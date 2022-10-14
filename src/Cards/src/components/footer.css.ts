import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const container = style({
    borderTopLeftRadius: varsApp.space.large,
    borderTopRightRadius: varsApp.space.large,
    padding: varsApp.space.large,
});

export const footer = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export const link = style({
    color: varsApp.color.light.hex,
});
