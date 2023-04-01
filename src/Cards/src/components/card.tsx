import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as styles from "./card.css";

import {
    FacebookIcon,
    GithubIcon,
    InstagramIcon,
    MailIcon,
    SmartphoneIcon,
    SnappyIcon,
    TwitchIcon,
    TwitterIcon,
    WebIcon,
    YoutubeIcon
} from "./icons";
import { constant, pipe } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { RemoteImageAdt } from "../model/remote-image";

export type CardData = {
    name: O.Option<string>;
    sub: O.Option<string>;

    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
    twitter: O.Option<string>;
    facebook: O.Option<string>;
    youtube: O.Option<string>;
    instagram: O.Option<string>;
    twitch: O.Option<string>;
    github: O.Option<string>;
};

type CardProps = {
    data: CardData;
    avatar: ADTType<typeof RemoteImageAdt>;
    expanded: boolean;
    onExpandClick: VoidFunction;
};

export const Card: FunctionComponent<CardProps> = ({
    data: { sub, ...details },
    avatar,
    expanded,

    onExpandClick,
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
                    (cardData) => <Details {...cardData} expanded={expanded} onExpandClick={onExpandClick} />
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

type DetailProps =
    & Omit<CardData, "avatar" | "sub">
    & {
        expanded: boolean;
        onExpandClick: VoidFunction;
    };

const Details: FunctionComponent<DetailProps> = ({
    expanded,
    onExpandClick,

    name,
    ...details
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

            <DetailLine caption={details.phone} icon={SmartphoneIcon} />
            <DetailLine caption={details.mail} icon={MailIcon} />
            <DetailLine caption={details.web} icon={WebIcon} />

            {expanded && <>
                <DetailLine caption={details.twitter} icon={TwitterIcon} />
                <DetailLine caption={details.facebook} icon={FacebookIcon} />
                <DetailLine caption={details.youtube} icon={YoutubeIcon} />
                <DetailLine caption={details.instagram} icon={InstagramIcon} />
                <DetailLine caption={details.twitch} icon={TwitchIcon} />
                <DetailLine caption={details.github} icon={GithubIcon} />
            </>}

        </ul>
        <button onClick={onExpandClick}>Toggle</button>

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

type DetailLineProps = {
    icon: SnappyIcon;
    caption: O.Option<string>;
};

const DetailLine: FunctionComponent<DetailLineProps> = ({
    caption,
    icon: Icon,
}) => pipe(
    caption,
    O.fold(
        Empty,
        (caption: string) => <li className={`${styles.detailLine}`}>
            <Icon className={styles.detailIcon} />
            <span>{caption}</span>
        </li>
    )
);
