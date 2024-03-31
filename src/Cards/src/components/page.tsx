import * as styles from "./page.css";

import type { FunctionComponent } from "preact";
import { assignInlineVars } from "@vanilla-extract/dynamic";

type FitHeightTypes = "content" | "screen";

type PageProps = {
    align?: "center" | "start" | "end";
    fit?: FitHeightTypes;
};

export const Page: FunctionComponent<PageProps> = ({
    children,
    align = "center",
}) => (
    <section
        className={styles.page}
        style={assignInlineVars({
            [styles.CssVarAlignment]: align,
        })}
    >
        {children}
    </section>
);
