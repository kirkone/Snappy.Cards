import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as styles from "./card.css";

import { AppData, ImageDataAdt } from "../model/app-data";
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
import { DetailLine, DetailLink, DetailList } from "./detail-list";
import { constant, identity, pipe, tuple } from "fp-ts/function";

import type { ADTType } from "@morphic-ts/adt";
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
    maximumDetailsVisible: O.Option<number>;
    avatarAppData: AppData["avatar"],

    onExpandClick: VoidFunction;
};

export const Card: FunctionComponent<CardProps> = ({
    data: { sub, name, job, ...media },
    avatar,
    expanded,
    maximumDetailsVisible,
    avatarAppData,

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
                    Failure: ({ error }) => <div className={styles.layoutNarrow}>
                        <Avatar
                            url={error.remoteUrl}
                            name={name}
                            avatarAppData={avatarAppData}
                        />
                    </div>,
                    Loaded: ({ objectUrl }) => <div className={styles.layoutNarrow}>
                        <Avatar
                            url={objectUrl}
                            name={name}
                            avatarAppData={avatarAppData}
                        />
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
                        maximumDetailsVisible={maximumDetailsVisible}
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
    maximumDetailsVisible: O.Option<number>;

    expanded: boolean;
    onExpandClick: VoidFunction;
};

const Details: FunctionComponent<DetailProps> = ({
    name,
    job,
    media,
    maximumDetailsVisible,

    expanded,
    onExpandClick,
}) => {
    const splitDetails = pipe(
        maximumDetailsVisible,
        O.fold(
            constant(a => [a, []]),
            A.splitAt,
        ),
    );

    const headingClassName = pipe(
        job,
        O.fold(
            constant(styles.headingMarginBig),
            constant("")
        )
    );

    return <address className={styles.layoutWide}>
        <DetailList>
            {pipe(
                name,
                O.fold(
                    Empty,
                    n => <DetailLine>
                        <h3 className={`${headingClassName} ${styles.detailHeading}`}>
                            {n}
                        </h3>
                    </DetailLine>
                )
            )}

            {pipe(
                job,
                O.fold(
                    Empty,
                    pos => <DetailLine>
                        <h4 className={styles.detailSubHeading}>{pos}</h4>
                    </DetailLine>
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
                splitDetails,

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
        </DetailList>
    </address>;
};

type AvatarProps = {
    url: string;
    name: O.Option<string>;
    avatarAppData: AppData["avatar"];
};

const Avatar: FunctionComponent<AvatarProps> = ({ url, name, avatarAppData }) => (
    <div className={styles.avatarCircle}>
        <img src={url}
            className={styles.avatar}
            alt={pipe(
                name,
                O.fold(
                    constant("Avatar"),
                    name => `Avatar of ${name}`
                )
            )}
            {...pipe(
                avatarAppData,
                O.chain(O.fromPredicate(ImageDataAdt.is.Snappy)),
                O.fold(
                    constant({}),
                    (snappyImage): Pick<JSX.HTMLAttributes, "srcSet" | "sizes"> => ({
                        srcSet: snappyImage.srcset,
                        sizes: `${styles.AVATAR_SIZE}px`,
                    })
                )
            )}
        />
    </div>
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
    <DetailLine
        className={`
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
    </DetailLine>
);

const getLinkForMedium = getUnionTypeMatcherStrict<keyof Media>()({
    phone: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={SmartphoneIcon}
            href={`tel:${value}`}
        />
    ),

    mail: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={MailIcon}
            href={`mailto:${value}`}
        />
    ),

    web: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={WebIcon}
            href={value.match(/^https?:\/\//) ? value : `https://${value}`}
            target="_blank"
        />
    ),

    twitter: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={XIcon}
            href={`https://twitter.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    facebook: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={FacebookIcon}
            href={`https://www.facebook.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    youtube: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={YoutubeIcon}
            href={`https://www.youtube.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    instagram: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={InstagramIcon}
            href={`https://www.instagram.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    twitch: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={TwitchIcon}
            href={`https://www.twitch.tv/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    github: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={GithubIcon}
            href={`https://github.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    linkedIn: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={LinkedInIcon}
            href={`https://www.linkedin.com/in/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    xing: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={XingIcon}
            href={`https://www.xing.com/profile/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    paypal: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={PaypalIcon}
            href={`https://www.paypal.com/paypalme/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    patreon: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={PatreonIcon}
            href={`https://www.patreon.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    pinterest: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={PinterestIcon}
            href={`https://www.pinterest.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    npm: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={NpmIcon}
            href={`https://www.npmjs.com/~${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    soundcloud: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={SoundcloudIcon}
            href={`https://soundcloud.com/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    snapchat: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={SnapchatIcon}
            href={`https://www.snapchat.com/add/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    steam: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={SteamIcon}
            href={`https://steamcommunity.com/id/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    cpan: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={CpanIcon}
            href={`https://metacpan.org/author/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

});

type LinkForMediumProps = {
    name: keyof Media;
    caption: string;
};

const LinkForMedium: FunctionComponent<LinkForMediumProps> = ({
    name, caption
}) => getLinkForMedium(name)(caption);
