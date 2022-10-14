import * as styles from "./qr-code-card.css";

import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { QrCode } from "./qr-code";

type QrCodeCardProps = {
    href: string;
    className?: string;
};

export const QrCodeCard: FunctionComponent<QrCodeCardProps> = ({
    href,
    className = "",
}) => (
    <PageContent className={className}>
        <QrCode text={href}
            border={5}
            className={styles.qrCode}
        />
    </PageContent>
);
