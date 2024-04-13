import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const qrCode = style({
    borderRadius: varsApp.space.small,

    backgroundColor: `rgb(${varsApp.color.light.rgb},.75)`,
    color: varsApp.color.dark.hex,

    scrollSnapAlign: "center",
    scrollSnapStop: "always",

    display: "block"
});

export const firstQr = style({
    // marginBottom: varsApp.space.large
});

export const outer = style({
    borderRadius: varsApp.space.small,

    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    gap: varsApp.space.large,

    scrollbarWidth: "none",

    overflowX: "auto",
    overflowY: "hidden",

    aspectRatio: "1",

    scrollSnapType: "both mandatory",
    scrollBehavior: "smooth",

    overscrollBehaviorX: "none",
    overscrollBehaviorY: "unset",

    "@media": {
        "(hover: none)": {
            // ...and vertical on desktop
            flexDirection: "row",
            overflowX: "hidden",
            overflowY: "auto",
            overscrollBehaviorX: "unset",
            overscrollBehaviorY: "none",
        }
    }
});
