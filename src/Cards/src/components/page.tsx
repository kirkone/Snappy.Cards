import * as styles from "./page.css";

import type { FunctionComponent } from "preact";
import { absurd } from "fp-ts/function";
import { assignInlineVars } from "@vanilla-extract/dynamic";

type FitHeightTypes = "content" | "screen";

type PageProps = {
    align?: "center" | "start" | "end";
    fit?: FitHeightTypes;
};

export const Page: FunctionComponent<PageProps> = ({
    children,
    align = "center",
    fit = "screen"
}) => (
    <section
        className={styles.page}
        style={assignInlineVars({
            [styles.CssVarAlignment]: align,
            [styles.CssVarFit]: translateFitToCss(fit),
        })}
    >
        {children}
    </section>
);

const translateFitToCss = (fit: FitHeightTypes) => {
    switch (fit) {
        case "content": return "fit-content";
        case "screen": return "100%";

        default: return absurd<FitHeightTypes>(fit);
    }
};
