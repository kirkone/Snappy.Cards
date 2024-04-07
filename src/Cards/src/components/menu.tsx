import * as A from "fp-ts/Array";
import * as Routes from "../model/routes";
import * as styles from "./menu.css";

import { CardIcon, QrCodeIcon, ShareIosIcon, ShareMdIcon } from "./icons";
import { constant, flow, identity, pipe } from "fp-ts/function";

import { ADTType } from "@morphic-ts/adt";
import { BrowserDataAdt } from "../model/browser-data";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import type { Route } from "../model/routes";
import { assignInlineVars } from "@vanilla-extract/dynamic";

// eslint-disable-next-line functional/no-mixed-types
type MenuProps = {
    className?: string;
    browserData: ADTType<typeof BrowserDataAdt>;

    onClick: (clicked: Route) => void;
};

export const Menu: FunctionComponent<MenuProps> = ({
    className = "",
    browserData,

    onClick,
}) => (
    <header className={styles.header}>
        <PageContent className={`${className} ${styles.wrapper}`}>
            <menu className={`${styles.menu}`}>
                <a href="" onClick={flow(
                    preventDefault,
                    () => onClick(Routes.as.Card),
                )} >
                    <CardIcon />
                </a>

                <a href="" onClick={flow(
                    preventDefault,
                    () => onClick(Routes.as.Qr),
                )} >
                    <QrCodeIcon />
                </a>

                <a href="" onClick={flow(
                    preventDefault,
                    () => onClick(Routes.as.Share),
                )} >
                    {pipe(
                        browserData,
                        BrowserDataAdt.matchStrict({
                            NotLoaded: constant(<ShareMdIcon />),
                            Loading: constant(<ShareMdIcon />),
                            Failure: constant(<ShareMdIcon />),
                            Loaded: ({ osMode }) => osMode === "ios" ?
                                <ShareIosIcon /> :
                                <ShareMdIcon />,
                        }),
                    )}
                </a>
            </menu>
            <div className={styles.navActiveWrapper}>
                <svg className={styles.svg} viewBox="0 0 86 8">
                    {pipe(
                        dotArray,
                        A.map(
                            i => <circle
                                style={assignInlineVars({
                                    [styles.CSSVarAnimationIndex]: `${i}`
                                })}

                                className={styles.dot}
                                r={4}
                                cy={4}
                            />
                        )
                    )}
                </svg>
            </div>
        </PageContent>
    </header>
);

const dotArray = A.makeBy(3, identity);

const preventDefault = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    return e;
};
