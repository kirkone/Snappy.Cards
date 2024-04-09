import * as styles from "./page.css";

import type { FunctionComponent } from "preact";
import { Route } from "../model/routes";
import { assignInlineVars } from "@vanilla-extract/dynamic";

type FitHeightTypes = "content" | "screen";

type PageProps = {
    route?: Route,
    align?: "center" | "start" | "end";
    fit?: FitHeightTypes;
};

export const Page: FunctionComponent<PageProps> = ({
    route,
    children,
    align = "center",
}) => (
    <section
        id={route}
        className={styles.page}
        style={assignInlineVars({
            [styles.CssVarAlignment]: align,
        })}
    >
        {children}
    </section>
);
