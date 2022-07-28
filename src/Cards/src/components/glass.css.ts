import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const glass = style({
    backgroundColor: `rgb(${varsApp.color.primary.rgb},.45)`,
    backdropFilter: `blur(${varsApp.space.large})`,
    WebkitBackdropFilter: `blur(${varsApp.space.large})`,
});
