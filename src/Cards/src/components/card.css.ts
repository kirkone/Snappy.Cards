import { createVar, keyframes, style } from "@vanilla-extract/css";

import { calc } from "@vanilla-extract/css-utils";
import { varsApp } from "../theme/variables.css";

const ellipsisLine = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
} as const;

export const container = style({
    // bottom layout background is clipped by rounded corners
    overflow: "hidden",
});

export const card = style({
    display: "flex",
    flexWrap: "wrap",
});

export const layoutNarrow = style({
    margin: "0 auto", // center after detail breaks to new line

    padding: varsApp.space.medium,
    paddingBottom: varsApp.space.large,
});

export const layoutWide = style({
    flex: 1,

    padding: varsApp.space.medium,
    paddingBottom: varsApp.space.large,

    // control text overflow
    maxWidth: "100%",
});

export const layoutBottom = style({
    flex: "1 0 100%",

    // padding of card works really well with layoutNarrow and layoutWide
    // so keep padding of card and work against it here to reach edge of card
    // 1. first cancel container padding, left, right and bottom
    margin: calc.negate(varsApp.space.large),
    marginTop: 0,

    // 2. bring back paddings similar to container plus layout{Wide,Narrow}
    padding: `
        0
        ${calc.add(varsApp.space.large, varsApp.space.medium)}
    `,

    backgroundColor: `rgb(${varsApp.color.light.rgb}, 0.1)`,

    // font
    color: `rgb(${varsApp.color.light.rgb}, 0.1)`,
    fontWeight: 900,
    fontSize: "5rem",
    minHeight: "7rem",
    textAlign: "center",
    lineHeight: 7 / 5,
    ...ellipsisLine,
});

export const avatarCircle = style({
    // circle shape
    width: 120,
    height: 120,
    borderRadius: "50%",
    overflow: "hidden",

    // ring
    boxShadow: `0 0 0 ${varsApp.space.medium} rgb(${varsApp.color.dark.rgb}, 0.1)`,
    margin: varsApp.space.medium, // box shadow does not change dimensions

    // to center and align contained image
    position: "relative",
});

export const avatar = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
});

export const detailHeading = style({
    fontSize: "2.5rem",
    fontWeight: 600,
    lineHeight: 1,
    paddingBottom: varsApp.space.small,

    ...ellipsisLine,
});

export const detailSubHeading = style({
    fontSize: "2rem",
    paddingBottom: varsApp.space.medium,

    ...ellipsisLine,
});

export const headingMarginBig = style({
    paddingBottom: varsApp.space.large
});

export const detailIcon = style({
    verticalAlign: "-17%",
    marginRight: "0.5em",
});

export const expandButton = style({
    border: `1px solid rgba(${varsApp.color.text.rgb}, 0.2)`,
    display: "block",
    width: "100%",
    lineHeight: 2,
    borderRadius: varsApp.space.small,
    marginTop: varsApp.space.medium,
    cursor: "pointer"
});

// ============================================================================
// Animation
// ============================================================================
export const animationIndex = createVar();

const ANIMATION_DURATION = "0.25s";

const staggeredEnter = keyframes({
    from: {
        opacity: 0,
        transform: "translateY(1em)",
    },
    to: {
        opacity: 1,
        transform: "translateY(0)",
    }
});

export const animatedLine = style({
    overflow: "hidden",
    height: 0,

    // transition height without staggering to prepare staggered animation
    transition: `height ${ANIMATION_DURATION} ease`,
});

export const animatedLineExpanded = style({
    // fixed height for animation
    // animating to 100% content height is not possible
    height: "2em",

    animationName: staggeredEnter,
    animationDuration: ANIMATION_DURATION,
    animationFillMode: "both",
    animationTimingFunction: "ease",
    animationDelay: calc.multiply(animationIndex, "0.1s"),
});

export const chevronCollapsed = style({
    transform: "rotate(0deg)",
    transition: `transform ${ANIMATION_DURATION} ease`,
});
export const chevronExpanded = style({
    transform: "rotate(180deg)",
});
