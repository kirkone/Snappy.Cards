import * as Routes from "../model/routes";
import * as styles from "./menu.css";

import { CardIcon, GithubFillIcon, InfoIcon, QrCodeIcon, ShareMdIcon, TwitchIcon } from "./icons";

import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import type { Route } from "../model/routes";
import { flow } from "fp-ts/function";

// eslint-disable-next-line functional/no-mixed-types
type MenuProps = {
    className?: string;

    onClick: (clicked: Route) => void;
};

export const Menu: FunctionComponent<MenuProps> = ({
    className = "",

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
                    () => onClick(Routes.as.Info),
                )} >
                    <InfoIcon />
                </a>
            </menu>
        </PageContent>
    </header>
);

const preventDefault = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    return e;
};
