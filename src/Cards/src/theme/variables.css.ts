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
        dark: {
            hex: null,
            rgb: null,
            tint: null,
        },
        light: {
            hex: null,
            rgb: null,
            shade: null,
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
const lightThemeVars = assignVars(varsApp, {
    color: {
        primary: {
            hex: "#A4A4A4",
            rgb: "164,164,164"
        },
        light: {
            hex: "#FFFFFF",
            rgb: "255,255,255",
            shade: "#5A5A64",
        },
        dark: {
            hex: "#000000",
            rgb: "0,0,0",
            tint: "#080808",
        },
        shadow: {
            hex: "#001428",
            rgb: "0,10,20",
        },
        text: {
            hex: "#000000",
            rgb: "0,0,0"
        }
    },
    space: {
        small: "0.5rem",
        medium: "1rem",
        large: "2rem",
    }
});

const darkThemeVars = assignVars(varsApp, {
    color: {
        primary: {
            hex: "#404040",
            rgb: "64,64,64"
        },
        dark: {
            hex: "#FFFFFF",
            rgb: "255,255,255",
            tint: "#5A5A64",
        },
        light: {
            hex: "#000000",
            rgb: "0,0,0",
            shade: "#080808",
        },
        shadow: {
            hex: "#001428",
            rgb: "0,10,20",
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
    vars: lightThemeVars,

    "@media": {
        "(prefers-color-scheme: dark)": {
            vars: darkThemeVars,
        },
    },
});
