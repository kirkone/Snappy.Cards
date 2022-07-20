import { style } from "@vanilla-extract/css";

export const app = style({
    height: "100vh",
    width: "100vw",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
});

export const card = style({
    minHeight: 300,
    paddingBottom: "10rem",
    gap: "2rem",
});
