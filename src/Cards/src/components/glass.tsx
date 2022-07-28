import * as styles from "./glass.css";

import type { FunctionComponent } from "preact";

export const Glass: FunctionComponent<{ className?: string; }> = ({
    children,
    className = "",
}) => (
    <div className={`${styles.glass} ${className}`}>
        {children}
    </div>
);
