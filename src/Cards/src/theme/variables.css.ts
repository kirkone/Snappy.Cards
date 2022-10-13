import { assignVars, createThemeContract, style } from "@vanilla-extract/css";

// ============================================================================
// 1. create global variable names
// ============================================================================
export const varsApp = createThemeContract({
    color: {
        primary: {
            hex: null,
            rgb: null,
        },
        light: {
            hex: null,
            rgb: null,
        },
        shadow: {
            hex: null,
            rgb: null,
        },
        text: {
            hex: null,
            rgb: null,
        }
    },
    space: {
        small: null,
        medium: null,
        large: null,
    }
});

// ============================================================================
// 2. assign values to css variables
// ============================================================================
const darkThemeVars = assignVars(varsApp, {
    color: {
        primary: {
            hex: "#404040",
            rgb: "64,64,64"
        },
        light: {
            hex: "#FFFFFF",
            rgb: "255,255,255",
        },
        shadow: {
            hex: "#001428",
            rgb: "0,20,40",
        },
        text: {
            hex: "#FFFFFF",
            rgb: "255,255,255"
        }
    },
    space: {
        small: "0.5rem",
        medium: "1rem",
        large: "2rem",
    }
});

// ============================================================================
// 3. export themes
// ============================================================================
export const defaultTheme = style({
    // vars: lightThemeVars,
    vars: darkThemeVars,

    "@media": {
        "(prefers-color-scheme: dark)": {
            vars: darkThemeVars,
        },
    },
});
