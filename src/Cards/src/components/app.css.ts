import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

export const app = style({
    height: "100%",
    width: "100vw",

    overflow: "auto",
    minWidth: "30rem",

    scrollSnapType: "both mandatory",
    scrollBehavior: "smooth",

    display: "flex",
    flexWrap: "wrap",
    // horizontal on mobile ...
    flexDirection: "row",
    gap: "10rem",

    "@media": {
        "(hover: none)": {
            // ...and vertical on desktop
            flexDirection: "column"
        }
    }
});

export const backgroundImage = style({
    position: "fixed",
    zIndex: -1,
    width: "100%",
    height: "100%",
    objectFit: "cover",

    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",

    backgroundImage: `
        -webkit-radial-gradient(
            top,
            ${varsApp.color.dark.tint},
            ${varsApp.color.light.shade}
        )
    `,
});
