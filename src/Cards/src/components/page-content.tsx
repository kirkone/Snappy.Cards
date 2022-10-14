import * as styles from "./page-content.css";

import type { FunctionComponent } from "preact";

export const PageContent: FunctionComponent<{ className?: string; }> = ({
    children,
    className = "",
}) => (
    <div className={`${styles.content} ${className}`}>
        {children}
    </div>
);
