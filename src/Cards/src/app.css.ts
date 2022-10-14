import { style } from "@vanilla-extract/css";

export const app = style({
    height: "100vh",
    width: "100vw",

    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",

    overflowY: "auto",
});
