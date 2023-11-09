import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as styles from "./card.css";

import {
    ChevronDownIcon,
    CpanIcon,
    FacebookIcon,
    GithubIcon,
    InstagramIcon,
    LinkedInIcon,
    MailIcon,
    NpmIcon,
    PatreonIcon,
    PaypalIcon,
    PinterestIcon,
    SmartphoneIcon,
    SnapchatIcon,
    SoundcloudIcon,
    SteamIcon,
    TwitchIcon,
    WebIcon,
    XIcon,
    XingIcon,
    YoutubeIcon
} from "./icons";
import { constant, identity, pipe, tuple } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
import { AppData } from "../model/app-data";
import type { FunctionComponent } from "preact";
import { PageContent } from "./page-content";
import { RemoteImageAdt } from "../model/remote-image";
import { Simplify } from "type-fest";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { getUnionTypeMatcherStrict } from "../utils/utils";

type Media = Pick<AppData,
    | "phone"
    | "mail"
    | "web"
    | "twitter"
    | "facebook"
    | "youtube"
    | "instagram"
    | "twitch"
    | "github"
    | "linkedIn"
    | "xing"
    | "paypal"
    | "patreon"
    | "pinterest"
    | "npm"
    | "soundcloud"
    | "snapchat"
    | "steam"
    | "cpan"
>;

export type CardData = Simplify<
    & Pick<AppData, "name" | "job" | "sub">
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

            {pipe(
                sub,
                O.fold(
                    Empty,
                    (s) => <div className={styles.layoutBottom}>
                        <span>{s}</span>
                    </div>
                )
            )}

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
                    // business
                    "phone",
                    "mail",
                    "web",
                    "linkedIn",
                    "xing",

                    // social media
                    "twitter",
                    "facebook",
                    "youtube",
                    "instagram",
                    "pinterest",
                    "snapchat",

                    // dev
                    "github",
                    "npm",
                    "cpan",

                    // payment
                    "paypal",
                    "patreon",

                    // gaming
                    "twitch",
                    "steam",

                    // media
                    "soundcloud",
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

    linkedIn: () => (value: string) => (
        <a href={`https://www.linkedin.com/in/${encodeURIComponent(value)}`}
            target="_blank">

            <LinkedInIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    xing: () => (value: string) => (
        <a href={`https://www.xing.com/profile/${encodeURIComponent(value)}`}
            target="_blank">

            <XingIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    paypal: () => (value: string) => (
        <a href={`https://www.paypal.com/paypalme/${encodeURIComponent(value)}`}
            target="_blank">

            <PaypalIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    patreon: () => (value: string) => (
        <a href={`https://www.patreon.com/${encodeURIComponent(value)}`}
            target="_blank">

            <PatreonIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    pinterest: () => (value: string) => (
        <a href={`https://www.pinterest.com/${encodeURIComponent(value)}`}
            target="_blank">

            <PinterestIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    npm: () => (value: string) => (
        <a href={`https://www.npmjs.com/~${encodeURIComponent(value)}`}
            target="_blank">

            <NpmIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    soundcloud: () => (value: string) => (
        <a href={`https://soundcloud.com/${encodeURIComponent(value)}`}
            target="_blank">

            <SoundcloudIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    snapchat: () => (value: string) => (
        <a href={`https://www.snapchat.com/add/${encodeURIComponent(value)}`}
            target="_blank">

            <SnapchatIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    steam: () => (value: string) => (
        <a href={`https://steamcommunity.com/id/${encodeURIComponent(value)}`}
            target="_blank">

            <SteamIcon className={styles.detailIcon} />
            <span>{value}</span>
        </a>
    ),

    cpan: () => (value: string) => (
        <a href={`https://metacpan.org/author/${encodeURIComponent(value)}`}
            target="_blank">

            <CpanIcon className={styles.detailIcon} />
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
