import * as styles from "./qr-code-card.css";
import * as theme from "../theme/variables.css";

import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { QrCode } from "./qr-code";

type QrCodeCardProps = {
    href: string;
    vcard: string;
    className?: string;
};

export const QrCodeCard: FunctionComponent<QrCodeCardProps> = ({
    href,
    vcard,
    className = "",
}) => (
    <PageContent className={`${className}`}>
        <div className={styles.outer}>
            <QrCode text={href}
                border={5}
                className={`${styles.qrCode} ${styles.firstQr} ${theme.lightTheme}`}
            />
            <QrCode text={vcard}
                border={5}
                className={`${styles.qrCode} ${theme.lightTheme}`}
            />
        </div>
    </PageContent>
);
