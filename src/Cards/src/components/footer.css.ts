import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const container = style({
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
});

export const footer = style({
    display: "flex",

});

export const linkLeft = style({
    padding: `0 ${varsApp.space.small}`,
    marginRight: "auto"
});

export const linkRight = style({
    padding: `0 ${varsApp.space.small}`,
});

export const textColor = style({
    color: varsApp.color.dark.hex,
});
