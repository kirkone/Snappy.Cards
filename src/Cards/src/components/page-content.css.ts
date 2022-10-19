import { style } from "@vanilla-extract/css";
import { varsApp } from "../theme/variables.css";

const makeBoxShadow = (rgb: string, s1: number, s2: number) => `
    0.6px 0.7px 1px rgb(${rgb}, ${s1}),
    3.2px 3.7px 5.3px -0.3px rgb(${rgb}, ${s1}),
    5.9px 6.8px 9.8px -0.7px rgb(${rgb}, ${s1}),
    9.4px 10.9px 15.7px -1px rgb(${rgb}, ${s1}),
    14.6px 16.9px 24.3px -1.4px rgb(${rgb}, ${s1}),
    22.1px 25.7px 36.9px -1.7px rgb(${rgb}, ${s2}),
    32.9px 38.2px 54.8px -2.1px rgb(${rgb}, ${s2}),
    47.7px 55.3px 79.4px -2.4px rgb(${rgb}, ${s2}),
    67.2px 77.9px 111.9px -2.7px rgb(${rgb}, ${s2})
`;

export const content = style({
    // glass
    backgroundColor: `rgb(${varsApp.color.primary.rgb},.45)`,
    WebkitBackdropFilter: `blur(${varsApp.space.large})`,
    backdropFilter: `blur(${varsApp.space.large})`,

    // for hover
    transition: "background 1s, box-shadow 1s",

    // flex from page
    flex: 1,

    // layout
    borderRadius: varsApp.space.large,
    padding: varsApp.space.large,

    boxShadow: makeBoxShadow(varsApp.color.shadow.rgb, 0.1, 0.09),

    selectors: {
        "&:hover": {
            backgroundColor: `rgb(${varsApp.color.primary.rgb},.65)`,
            boxShadow: makeBoxShadow(varsApp.color.shadow.rgb, 0.2, 0.15),
        },
    },

    "@supports": {
        "not((-webkit-backdrop-filter: none) or (backdrop-filter: none))": {
            backgroundColor: `rgb(${varsApp.color.primary.rgb})`,
        }
    }
});
