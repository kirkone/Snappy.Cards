import { createVar, globalStyle, style } from "@vanilla-extract/css";

export const CssVarAlignment = createVar();

export const page = style({
    height: "100vh",

    position: "sticky",
    top: 0,

    display: "flex",
    justifyContent: "center",
    alignItems: CssVarAlignment,
});

globalStyle(`${page}>div`, {
    // position: "relative",

    width: "50rem",
    minWidth: "20rem",

    // display: "flex",
    // flexFlow: "row wrap",
    // justifyContent: "center",
    // alignItems: "center",

    // backgroundColor: "rgb(64 64 64 / 45%)",
    // backdropFilter: "blur(20px)",
    // WebkitBackdropFilter: "blur(20px)",

    // @supports ( not((-webkit-backdrop-filter: none) or (backdrop-filter: none))) {
    //     background-color: rgb(64 64 64 / 85%);
    // }

    // boxShadow: "var(--shadow-elevation-high)",
    // boxShadow: "0 25px 25px rgba(0,0,0,0.1)",
    // borderRadius: "20px",
    // borderTop: "1px solid rgba(255, 255, 255, 0.5)",

    // overflow: "hidden",

    // transition: "background 1s",

    // pointerEvents: "auto",
});

//     &:hover{
//     background: rgb(64 64 64 / 65 %);
// }
