import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const background = style({
    backgroundColor: varsApp.color.text.hex
});
