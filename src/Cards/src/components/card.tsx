import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as styles from "./card.css";

import { MailIcon, SmartphoneIcon, WebIcon } from "./icons";
import { constant, pipe } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { RemoteImageAdt } from "../model/remote-image";

export type CardData = {
    name: O.Option<string>;
    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
    sub: O.Option<string>;
};

type CardProps = {
    data: CardData;
    avatar: ADTType<typeof RemoteImageAdt>;
};

export const Card: FunctionComponent<CardProps> = ({
    data: { sub, ...details },
    avatar
}) => (
    <PageContent className={styles.container}>
        <div className={styles.card}>

            {pipe(
                avatar,
                RemoteImageAdt.match({
                    NotLoaded: Empty,
                    // TODO: Loading animation for avatar
                    Loading: Empty,
                    Loaded: ({ objectUrl }) => <div className={styles.layoutNarrow}>
                        <Avatar url={objectUrl} />
                    </div>,
                    Failure: ({ error }) => <div className={styles.layoutNarrow}>
                        <Avatar url={error.remoteUrl} />
                    </div>,
                })
            )}

            {pipe(
                details,
                O.fromPredicate(R.some(O.isSome)),
                O.fold(
                    Empty,
                    Details
                )
            )}

            <div className={styles.layoutBottom}>
                {pipe(
                    sub,
                    O.fold(
                        Empty,
                        (s) => <span>{s}</span>
                    )
                )}
            </div>

        </div>
    </PageContent>
);

const Empty = constant(<></>);

type DetailProps = Pick<CardData, "mail" | "name" | "phone" | "web">;

const Details: FunctionComponent<DetailProps> = ({
    mail,
    name,
    phone,
    web
}) => (
    <address className={styles.layoutWide}>
        <ul class={styles.detail}>
            {pipe(
                name,
                O.fold(
                    Empty,
                    (n) => <li className={styles.detailLine}>
                        <h3 className={styles.detailHeading}>{n}</h3>
                    </li>
                )
            )}

            {pipe(
                phone,
                O.fold(
                    Empty,
                    (p) => <li className={styles.detailLine}>
                        <SmartphoneIcon className={styles.detailIcon} />
                        <span>{p}</span>
                    </li>
                )
            )}

            {pipe(
                mail,
                O.fold(
                    Empty,
                    (m) => <li className={styles.detailLine}>
                        <MailIcon className={styles.detailIcon} />
                        <span>{m}</span>
                    </li>
                )
            )}

            {pipe(
                web,
                O.fold(
                    Empty,
                    (w) => <li className={styles.detailLine}>
                        <WebIcon className={styles.detailIcon} />
                        <span>{w}</span>
                    </li>
                )
            )}
        </ul>
    </address>
);

type AvatarProps = {
    url: string;
};

const Avatar: FunctionComponent<AvatarProps> = ({ url }) => (
    <div className={styles.avatarCircle}>
        <img src={url} className={styles.avatar} />
    </div>
);
