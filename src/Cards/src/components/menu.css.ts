import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const header = style({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
});

export const wrapper = style({
    width: "fit-content",

    margin: "0 auto",
    padding: varsApp.space.medium,

    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: varsApp.space.medium,
    borderTopRightRadius: varsApp.space.medium,
});

export const menu = style({
    display: "flex",
    gap: varsApp.space.medium,

    color: varsApp.color.dark.hex,
});
