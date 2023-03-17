import { style } from "@vanilla-extract/css";

export const card = style({
    display: "grid",
    perspective: "190rem",

    vars: {
        "--flipped": "0",
        "--delay": "0s",
    },

    selectors: {
        "&:hover": {
            vars: {
                "--flipped": "1",
                "--delay": "0s",
            }
        }
    },
});

export const cardFace = style({
    gridArea: "1 / -1 / 1 / -1",
    backfaceVisibility: "hidden",
    transition: "0.25s var(--delay) transform",
});

export const cardFaceFront = style({
    transform: "rotateY(calc(180deg * var(--flipped)))",
});

export const cardFaceBack = style({
    transform: "rotateY(calc(180deg * var(--flipped) - 180deg))",
});
