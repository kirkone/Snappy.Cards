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
    TwitchIcon,
    WebIcon,
    XIcon,
    YoutubeIcon
} from "./icons";
import { constant, identity, pipe, tuple } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { RemoteImageAdt } from "../model/remote-image";
import { Simplify } from "type-fest";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { getUnionTypeMatcherStrict } from "../utils/utils";

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

export type CardData = Simplify<
    & {
        name: O.Option<string>;
        job: O.Option<string>;
        sub: O.Option<string>;
    }
    & Media
>;

type CardProps = {
    data: CardData;
    avatar: ADTType<typeof RemoteImageAdt>;
    expanded: boolean;
    onExpandClick: VoidFunction;
};

export const Card: FunctionComponent<CardProps> = ({
    data: { sub, name, job, ...media },
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
                { ...media, name, job },
                O.fromPredicate(R.some(O.isSome)),
                O.fold(
                    Empty,
                    (media) => <Details
                        name={name}
                        job={job}
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
    job: O.Option<string>;
    media: Media;

    expanded: boolean;
    onExpandClick: VoidFunction;
};

const Details: FunctionComponent<DetailProps> = ({
    name,
    job,
    media,

    expanded,
    onExpandClick,
}) => {
    const visibleMedia = pipe(
        job,
        O.fold(
            constant(3),
            constant(2),
        )
    );

    const headingClassName = pipe(
        job,
        O.fold(
            constant(styles.headingMarginBig),
            constant("")
        )
    );

    return <address className={styles.layoutWide}>
        <ul className={styles.detail}>
            {pipe(
                name,
                O.fold(
                    Empty,
                    n => <li className={styles.detailLine}>
                        <h3 className={`${headingClassName} ${styles.detailHeading}`}>
                            {n}
                        </h3>
                    </li>
                )
            )}

            {pipe(
                job,
                O.fold(
                    Empty,
                    pos => <li className={styles.detailLine}>
                        <h4 className={styles.detailSubHeading}>{pos}</h4>
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
                    O.map(v => tuple(k, v))
                )),

                A.compact,
                A.splitAt(visibleMedia),

                // 3. render
                ([details, extendedDetails]) => <>
                    {pipe(
                        details,
                        A.map(([name, value]) => (
                            <DetailLine>
                                <LinkForMedium name={name} caption={value} />
                            </DetailLine>
                        ))
                    )}

                    {pipe(
                        extendedDetails,
                        A.mapWithIndex((idx, [name, value]) => (
                            <AnimatedDetailLine
                                expanded={expanded}
                                animationIndex={idx}>

                                <LinkForMedium name={name} caption={value} />
                            </AnimatedDetailLine>
                        ))
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
                                    <ChevronDownIcon className={`
                                        ${styles.detailIcon}
                                        ${styles.chevronCollapsed}
                                        ${expanded ? styles.chevronExpanded : ""}
                                    `} />
                                    {expanded ? "collapse" : `${A.size(a)} more`}
                                </button>
                            </li>
                        )
                    )}
                </>
            )}
        </ul>
    </address>;
};

type AvatarProps = {
    url: string;
};

const Avatar: FunctionComponent<AvatarProps> = ({ url }) => (
    <div className={styles.avatarCircle}>
        <img src={url} className={styles.avatar} />
    </div>
);

const DetailLine: FunctionComponent = ({ children }) => (
    <li className={styles.detailLine}>
        {children}
    </li>
);

type AnimatedDetailLineProps = {
    expanded: boolean;
    animationIndex: number;
};

const AnimatedDetailLine: FunctionComponent<AnimatedDetailLineProps> = ({
    expanded,
    animationIndex,
    children
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
        {children}
    </li>
);

const getLinkForMedium = getUnionTypeMatcherStrict<keyof Media>()({
    phone: () => (value: string) => (
        <a href={`tel:${value}`}>
            <SmartphoneIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    mail: () => (value: string) => (
        <a href={`mailto:${value}`}>
            <MailIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    web: () => (value: string) => (
        <a href={value.match(/^https?:\/\//) ? value : `http://${value}`}
            target="_blank">

            <WebIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    twitter: () => (value: string) => (
        <a href={`https://twitter.com/${encodeURIComponent(value)}`}
            target="_blank">

            <XIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    facebook: () => (value: string) => (
        <a href={`https://www.facebook.com/${encodeURIComponent(value)}`}
            target="_blank">

            <FacebookIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    youtube: () => (value: string) => (
        <a href={`https://www.youtube.com/${encodeURIComponent(value)}`}
            target="_blank">

            <YoutubeIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    instagram: () => (value: string) => (
        <a href={`https://www.instagram.com/${encodeURIComponent(value)}`}
            target="_blank">

            <InstagramIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    twitch: () => (value: string) => (
        <a href={`https://www.twitch.tv/${encodeURIComponent(value)}`}
            target="_blank">

            <TwitchIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    github: () => (value: string) => (
        <a href={`https://github.com/${encodeURIComponent(value)}`}
            target="_blank">

            <GithubIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),
});

type LinkForMediumProps = {
    name: keyof Media;
    caption: string;
};

const LinkForMedium: FunctionComponent<LinkForMediumProps> = ({
    name, caption
}) => getLinkForMedium(name)(caption);
