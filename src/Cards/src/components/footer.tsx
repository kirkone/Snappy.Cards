import * as O from "fp-ts/Option";
import * as styles from "./footer.css";

import { BrowserDataAdt, matchOsMode, matchShareMode } from "../model/browser-data";
import { ClipboardIcon, DownloadIcon, ErrorIcon, InfoIcon, LoaderIcon, ShareIosIcon, ShareMdIcon } from "./icons";
import { constant, pipe } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { VCardDataAdt } from "../model/v-card-url";
import { append } from "fp-ts-std/String";
import { sanitizeFilename } from "../utils/utils";

type FooterProps = {
    downloadUrl: ADTType<typeof VCardDataAdt>;
    browserData: ADTType<typeof BrowserDataAdt>;
    name: O.Option<string>;
    className?: string;

    onShareClick: VoidFunction;
};

export const Footer: FunctionComponent<FooterProps> = ({
    downloadUrl,
    browserData,
    name,
    className = "",

    onShareClick,
}) => (
    <PageContent className={`${styles.container} ${className}`}>
        <footer className={`${styles.footer} ${styles.textColor}`}>
            <a href="https://github.com/kirkone/Snappy.Cards"
                target="_blank"
                className={styles.linkLeft}
            >
                <InfoIcon />
            </a>

            <ShareLink
                browserData={browserData}
                onShareClick={onShareClick}
            />

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
            <a className={styles.linkRight}
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

type ShareLinkProps = Pick<FooterProps, "browserData" | "onShareClick">;

const ShareLink: FunctionComponent<ShareLinkProps> = ({
    browserData,
    onShareClick
}) => pipe(
    browserData,
    BrowserDataAdt.matchStrict({
        NotLoaded: () => <></>,
        Loading: () => <LoaderIcon />,
        Failure: () => <ErrorIcon />,
        Loaded: ({ shareMode, osMode }) => shareMode === "none" ?
            <></> :
            <a href="#"
                onClick={(e) => { e.preventDefault(); onShareClick(); }}
                className={styles.linkRight}
            >
                {pipe(
                    shareMode,
                    matchShareMode({
                        none: constant(<></>),
                        clipboard: constant(<ClipboardIcon />),
                        share: () => pipe(
                            osMode,
                            matchOsMode({
                                ios: constant(<ShareIosIcon />),
                                other: constant(<ShareMdIcon />),
                            })
                        )
                    })
                )}
            </a>
    })
);
