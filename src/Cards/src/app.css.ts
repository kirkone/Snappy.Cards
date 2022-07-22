import { keyframes, style } from "@vanilla-extract/css";

export const app = style({
    height: "100vh",
    width: "100vw",

    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",

    overflowY: "auto",
    // visibility: "hidden",
});

const fadeIn = keyframes({
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
});

export const qrCode = style({
    borderRadius: "20px",
    maxWidth: "100%",
    maxHeight: "calc(100vw - 6rem)",

    animation: `${fadeIn} 1s`,
    backgroundColor: "#ffffffaa",

    transition: "background 1s",

    boxShadow: "0px 0px 15px 0px rgb(0, 0, 0) inset",

    // path {
    //     stroke: rgb(0, 0, 0);
    // }

    selectors: {
        "&:hover": {
            backgroundColor: "white",
        }
    }
});

export const card = style({
    minHeight: 300,
    paddingBottom: "10rem",
    gap: "2rem",
});
