import * as O from "fp-ts/Option";
import * as styles from "./footer.css";

import { DownloadIcon, ErrorIcon, InfoIcon, LoaderIcon } from "./icons";
import { constant, pipe } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { VCardDataAdt } from "../model/v-card-url";
import { append } from "fp-ts-std/String";
import { sanitizeFilename } from "../utils/utils";

type FooterProps = {
    downloadUrl: ADTType<typeof VCardDataAdt>;
    name: O.Option<string>;
    className?: string;
};

export const Footer: FunctionComponent<FooterProps> = ({
    downloadUrl,
    name,
    className = "",
}) => (
    <PageContent className={`${styles.container} ${className}`}>
        <footer className={styles.footer}>
            <a href="https://github.com/kirkone/Snappy.Cards" target="_blank">
                <InfoIcon />
            </a>

            <DownloadLink
                downloadUrl={downloadUrl}
                name={name}
            />
        </footer>
    </PageContent>
);

type DownloadLinkProps = Pick<FooterProps, "downloadUrl" | "name">;

const DownloadLink: FunctionComponent<DownloadLinkProps> = ({
    downloadUrl,
    name,
}) => pipe(
    downloadUrl,
    VCardDataAdt.matchStrict({
        NotLoaded: () => <></>,
        Loading: () => <LoaderIcon />,
        Failure: () => <ErrorIcon />,
        Loaded: ({ url }) => (
            <a className={styles.link}
                rel="noopener"
                download={pipe(
                    name,
                    O.fold(
                        constant("SnappyCard"),
                        sanitizeFilename,
                    ),
                    append(".vcf")
                )}
                href={url}>
                <DownloadIcon />
            </a>
        )
    })
);
