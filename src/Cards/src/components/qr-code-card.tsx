import * as styles from "./qr-code-card.css";

import type { FunctionComponent } from "preact";
import { Glass } from "./glass";
import { QrCode } from "./qr-code";

type QrCodeCardProps = {
    href: string;
    className?: string;
};

export const QrCodeCard: FunctionComponent<QrCodeCardProps> = ({
    href,
    className = "",
}) => (
    <Glass className={`${styles.container} ${className}`}>
        <QrCode text={href}
            border={5}
            className={styles.qrCode}
        />
    </Glass>
);
