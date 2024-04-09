import * as O from "fp-ts/Option";
import * as styles from "./share-page.css";

import { constant, pipe } from "fp-ts/function";
import { BrowserDataAdt, matchOsMode, matchShareMode } from "../model/browser-data";
import { DetailLine, DetailLink, DetailList } from "./detail-list";
import { CopyIcon, DownloadIcon, ErrorIcon, GithubFillIcon, LoaderIcon, ShareIosIcon, ShareMdIcon } from "./icons";

import type { ADTType } from "@morphic-ts/adt";
import { append } from "fp-ts-std/String";
import { Fragment, type FunctionComponent } from "preact";
import { VCardDataAdt } from "../model/v-card-url";
import { sanitizeFilename } from "../utils/utils";
import { PageContent } from "./page-content";

type SharePageProps = {
    downloadUrl: ADTType<typeof VCardDataAdt>;
    browserData: ADTType<typeof BrowserDataAdt>;
    name: O.Option<string>;
    className?: string;

    onShareClick: VoidFunction;
};

export const SharePage: FunctionComponent<SharePageProps> = ({
    downloadUrl,
    browserData,
    name,
    className = "",

    onShareClick,
}) => (
    <PageContent className={className}>
        <DetailList>
            <ShareLink
                browserData={browserData}
                onShareClick={onShareClick}
            />
            <DownloadLink
                downloadUrl={downloadUrl}
                name={name}
                className={styles.githubMargin}
            />

            <DetailLine>
                <DetailLink
                    icon={GithubFillIcon}
                    caption="Documentation and code on GitHub"

                    href="https://github.com/kirkone/Snappy.Cards"
                    target="_blank"
                />
            </DetailLine>
        </DetailList>
    </PageContent>
);

type DownloadLinkProps =
    & Pick<SharePageProps, "downloadUrl" | "name">
    & { className?: string; };

const DownloadLink: FunctionComponent<DownloadLinkProps> = ({
    downloadUrl,
    name,
    className = "",
}) => pipe(
    downloadUrl,
    VCardDataAdt.matchStrict({
        NotLoaded: () => <></>,
        Loading: () => (
            <DetailLine className={className}>
                <DetailLink
                    icon={LoaderIcon}
                    caption="Loading contact data"
                />
            </DetailLine>
        ),
        Failure: () => (
            <DetailLine className={className}>
                <DetailLink
                    icon={ErrorIcon}
                    caption="Error loading contact data"
                />
            </DetailLine>
        ),
        Loaded: ({ url }) => (
            <DetailLine className={className}>
                <DetailLink
                    icon={DownloadIcon}
                    caption="Download this snappy.card as vCard"

                    rel="noopener"
                    download={pipe(
                        name,
                        O.fold(
                            constant("SnappyCard"),
                            sanitizeFilename,
                        ),
                        append(".vcf")
                    )}
                    href={url}
                />
            </DetailLine>
        )
    })
);

type ShareLinkProps = Pick<SharePageProps, "browserData" | "onShareClick">;

const ShareLink: FunctionComponent<ShareLinkProps> = ({
    browserData,
    onShareClick
}) => pipe(
    browserData,
    BrowserDataAdt.matchStrict({
        NotLoaded: () => <></>,
        Loading: () => (
            <DetailLine>
                <DetailLink
                    icon={LoaderIcon}
                    caption="Loading share link"
                />
            </DetailLine>
        ),
        Failure: () => (
            <DetailLine>
                <DetailLink
                    icon={ErrorIcon}
                    caption="Error loading share link"
                />
            </DetailLine>
        ),
        Loaded: ({ shareMode, osMode }) => shareMode === "none" ?
            <></> :
            <DetailLine>
                <DetailLink
                    icon={pipe(
                        shareMode,
                        matchShareMode({
                            none: constant(Fragment),
                            clipboard: constant(CopyIcon),
                            share: () => pipe(
                                osMode,
                                matchOsMode({
                                    ios: constant(ShareIosIcon),
                                    other: constant(ShareMdIcon),
                                })
                            )
                        })
                    )}
                    caption={pipe(
                        shareMode,
                        matchShareMode({
                            none: constant(""),
                            clipboard: constant("Copy snappy.card link"),
                            share: constant("Share snappy.card link"),

                        })
                    )}
                    href="#"
                    onClick={(e) => { e.preventDefault(); onShareClick(); }}
                />
            </DetailLine>
    })
);
