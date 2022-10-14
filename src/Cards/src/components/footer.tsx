import * as O from "fp-ts/Option";
import * as styles from "./footer.css";

import type { ADTType } from "@morphic-ts/adt";
import type { FunctionComponent } from "preact";
import { Glass } from "./glass";
import { VCardDataAdt } from "../app";
import { pipe } from "fp-ts/function";

type FooterProps = {
    downloadUrl: ADTType<typeof VCardDataAdt>;
    className?: string;
};

export const Footer: FunctionComponent<FooterProps> = ({
    downloadUrl,
    className = "",
}) => (
    <Glass className={`${styles.container} ${className}`}>
        <footer className={styles.footer}>
            <a href="https://github.com/kirkone/Snappy.Cards" target="_blank">
                <InfoIcon className={styles.link} />
            </a>

            {pipe(
                downloadUrl,
                O.fromPredicate(VCardDataAdt.is.Loaded),
                O.map(({ url }) => url),
                O.fold(
                    () => <></>,
                    (vCardUrl) => (
                        <a className={styles.link}
                            download="SnappyCard.vcf"
                            rel="noopener"
                            href={vCardUrl}>
                            <DownloadIcon />
                        </a>
                    )
                )
            )}
        </footer>
    </Glass>
);

type IconProps = {
    className?: string;
};

const InfoIcon: FunctionComponent<IconProps> = ({ className = "" }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M11 10.9794C11 10.4271 11.4477 9.97937 12 9.97937C12.5523 9.97937 13 10.4271 13 10.9794V16.9794C13 17.5317 12.5523 17.9794 12 17.9794C11.4477 17.9794 11 17.5317 11 16.9794V10.9794Z" fill="currentColor" /><path d="M12 6.05115C11.4477 6.05115 11 6.49886 11 7.05115C11 7.60343 11.4477 8.05115 12 8.05115C12.5523 8.05115 13 7.60343 13 7.05115C13 6.49886 12.5523 6.05115 12 6.05115Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="currentColor" />
    </svg>
);

const DownloadIcon: FunctionComponent<IconProps> = ({ className = "" }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"><path d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.1578L16.2428 8.91501L17.657 10.3292L12.0001 15.9861L6.34326 10.3292L7.75748 8.91501L11 12.1575V5Z" fill="currentColor" /><path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor" />
    </svg>
);
