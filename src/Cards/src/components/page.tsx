import * as styles from "./page.css";

import type { FunctionComponent } from "preact";

export const Page: FunctionComponent = ({ children }) => (
    <section className={styles.page}>
        {children}
    </section>
);
