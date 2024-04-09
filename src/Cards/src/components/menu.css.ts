import { createVar, fallbackVar, style } from "@vanilla-extract/css";

import { calc } from "@vanilla-extract/css-utils";
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

// ============================================================================
// Animation
// scroll-timeline is widely supported yet as of 2024-04-07
// otherwise scroll-timeline could replace css CSSVarScrollPercentage
// ============================================================================
export const CSSVarScrollPercentage = createVar();
export const CSSVarAnimationIndex = createVar();

export const navActiveWrapper = style({
    color: varsApp.color.dark.hex,
});

export const dot = style({
    fill: "currentcolor",
    transform: `translateX(${fallbackVar(CSSVarScrollPercentage, "0%")})`,
    transitionDelay: calc.multiply(CSSVarAnimationIndex, "2ms"),
    transitionTimingFunction: "linear",
    willChange: "transform"
});

export const svg = style({
    height: 6,
    width: 86,
    display: "block"
});
