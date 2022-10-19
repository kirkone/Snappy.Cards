import { style } from "@vanilla-extract/css";
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
    margin: `calc(${varsApp.space.large} * -1)`,
    marginTop: 0,

    // 2. bring back paddings similar to container plus layout{Wide,Narrow}
    padding: `
        0
        calc(${varsApp.space.large} + ${varsApp.space.medium})
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

export const detail = style({
    color: varsApp.color.text.hex,
    lineHeight: 2,
});

export const detailHeading = style({
    fontSize: "2.5rem",
    fontWeight: 600,
    lineHeight: 1,
    paddingBottom: "0.75em",
    ...ellipsisLine,
});

export const detailLine = style({
    // control text overflow
    ...ellipsisLine,
});

export const detailIcon = style({
    verticalAlign: "-18%",
    marginRight: "0.5em",
    color: `rgb(${varsApp.color.text.rgb}, 0.75)`,
});
