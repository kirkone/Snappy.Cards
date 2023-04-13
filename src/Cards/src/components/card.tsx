import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as styles from "./card.css";

import {
    ChevronDownIcon,
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
import { constant, identity, pipe, tuple } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { RemoteImageAdt } from "../model/remote-image";
import { assignInlineVars } from "@vanilla-extract/dynamic";

type Media = {
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

export type CardData =
    & {
        name: O.Option<string>;
        sub: O.Option<string>;
    }
    & Media;

const mediaToIcon: Record<keyof Media, SnappyIcon> = {
    phone: SmartphoneIcon,
    mail: MailIcon,
    web: WebIcon,
    twitter: TwitterIcon,
    facebook: FacebookIcon,
    youtube: YoutubeIcon,
    instagram: InstagramIcon,
    twitch: TwitchIcon,
    github: GithubIcon,
} as const;

type CardProps = {
    data: CardData;
    avatar: ADTType<typeof RemoteImageAdt>;
    expanded: boolean;
    onExpandClick: VoidFunction;
};

export const Card: FunctionComponent<CardProps> = ({
    data: { sub, name, ...media },
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
                media,
                O.fromPredicate(R.some(O.isSome)),
                O.fold(
                    Empty,
                    (media) => <Details
                        name={name}
                        media={media}
                        expanded={expanded}
                        onExpandClick={onExpandClick}
                    />
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

type DetailProps = {
    name: O.Option<string>;
    media: Media;

    expanded: boolean;
    onExpandClick: VoidFunction;
};

const Details: FunctionComponent<DetailProps> = ({
    name,
    media,

    expanded,
    onExpandClick,
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
                // 1. define order, that is used for display
                identity<Array<keyof Media>>([
                    "phone",
                    "mail",
                    "web",
                    "twitter",
                    "facebook",
                    "youtube",
                    "instagram",
                    "twitch",
                    "github",
                ]),

                // 2. get the value out of details, save ordered with its key
                A.map(k => pipe(
                    k,
                    k => R.lookup(k, media),
                    O.flatten,
                    O.map(v => tuple(k, v)),
                )),

                A.compact,
                A.splitAt(3),

                // 3. render
                ([details, extendedDetails]) => <>
                    {pipe(
                        details,
                        A.map(([name, value]) => (
                            <DetailLine
                                caption={value}
                                icon={mediaToIcon[name]} />
                        )),
                    )}

                    {pipe(
                        extendedDetails,
                        A.mapWithIndex((idx, [name, value]) => (
                            <AnimatedDetailLine
                                expanded={expanded}
                                caption={value}
                                icon={mediaToIcon[name]}
                                animationIndex={idx} />
                        )),
                    )}

                    {pipe(
                        extendedDetails,
                        NEA.fromArray,
                        O.fold(
                            Empty,
                            a => <li>
                                <button
                                    onClick={onExpandClick}
                                    class={styles.expandButton}
                                >
                                    <ChevronDownIcon class={`
                                        ${styles.detailIcon}
                                        ${styles.chevronCollapsed}
                                        ${expanded ? styles.chevronExpanded : ""}
                                    `}
                                    />
                                    {
                                        expanded ? "collapse" : `${A.size(a)} more`
                                    }
                                </button>
                            </li>
                        )
                    )}
                </>
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

type DetailLineProps = {
    icon: SnappyIcon;
    caption: string;
};

const DetailLine: FunctionComponent<DetailLineProps> = ({
    caption,
    icon: Icon,
}) => (
    <li className={styles.detailLine}>
        <Icon className={styles.detailIcon} />
        <span>{caption}</span>
    </li>
);

type AnimatedDetailLineProps = {
    icon: SnappyIcon;
    caption: string;
    expanded: boolean;
    animationIndex: number;
};

const AnimatedDetailLine: FunctionComponent<AnimatedDetailLineProps> = ({
    caption,
    icon: Icon,
    expanded,
    animationIndex
}) => (
    <li className={`
                    ${styles.detailLine}
                    ${styles.animatedLine}
                    ${expanded ? styles.animatedLineExpanded : ""}
                `}
        style={pipe(
            O.fromNullable(animationIndex),
            O.fold(
                () => ({}),
                i => assignInlineVars({ [styles.animationIndex]: `${i}` })
            )
        )}
    >
        <Icon className={styles.detailIcon} />
        <span>{caption}</span>
    </li>
);
