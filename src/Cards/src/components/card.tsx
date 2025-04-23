import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import * as O from "fp-ts/Option";
import * as styles from "./card.css";

import { constant, pipe } from "fp-ts/function";
import { DetailLine, DetailLink, DetailList } from "./detail-list";
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
    SignalIcon,
    SmartphoneIcon,
    SnapchatIcon,
    SoundcloudIcon,
    SteamIcon,
    TelegramIcon,
    TwitchIcon,
    WebIcon,
    XIcon,
    XingIcon,
    YoutubeIcon,
} from "./icons";

import type { ADTType } from "@morphic-ts/adt";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { FunctionComponent } from "preact";
import { Except } from "type-fest";
import { AppData, AppDataInfo } from "../model/app-data";
import { RemoteImageAdt } from "../model/remote-image";
import { getUnionTypeMatcherStrict } from "../utils/utils";
import { PageContent } from "./page-content";

export type CardData = Except<AppData, "config" | "avatar" | "background">;

export type CardProps = {
    data: CardData;
    avatar: ADTType<typeof RemoteImageAdt>;
    expanded: boolean;
    maximumDetailsVisible: O.Option<number>;

    onExpandClick: VoidFunction;
};

export const Card: FunctionComponent<CardProps> = ({
    data: { sub, name, job, info },
    avatar,
    expanded,
    maximumDetailsVisible,

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
                        <Avatar url={objectUrl} name={name} />
                    </div>,
                    Failure: ({ error }) => <div className={styles.layoutNarrow}>
                        <Avatar url={error.remoteUrl} name={name} />
                    </div>,
                })
            )}

            {pipe(
                [name, job, NEA.fromArray(info)],
                O.fromPredicate(A.some(O.isSome<unknown>)),
                O.fold(
                    Empty,
                    () => <Details
                        name={name}
                        job={job}
                        info={info}
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
    info: AppData["info"];
    maximumDetailsVisible: O.Option<number>;

    expanded: boolean;
    onExpandClick: VoidFunction;
};

const Details: FunctionComponent<DetailProps> = ({
    name,
    job,
    info,
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
                info,
                splitDetails,

                // 3. render
                ([details, extendedDetails]) => <>
                    {pipe(
                        details,
                        A.map(([name, value]) => (
                            <DetailLine>
                                <LinkForMedium name={name} value={value} />
                            </DetailLine>
                        ))
                    )}

                    {pipe(
                        extendedDetails,
                        A.mapWithIndex((idx, [name, value]) => (
                            <AnimatedDetailLine
                                expanded={expanded}
                                animationIndex={idx}>

                                <LinkForMedium name={name} value={value} />
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
};

const Avatar: FunctionComponent<AvatarProps> = ({ url, name }) => (
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

const getLinkForMedium = getUnionTypeMatcherStrict<AppDataInfo>()({
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

    signal: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={SignalIcon}
            href={`https://signal.me/#${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

    telegram: () => (value: string) => (
        <DetailLink
            caption={value}
            icon={TelegramIcon}
            href={`https://t.me/${encodeURIComponent(value)}`}
            target="_blank"
        />
    ),

});

type LinkForMediumProps = {
    name: AppDataInfo;
    value: string;
};

const LinkForMedium: FunctionComponent<LinkForMediumProps> = ({
    name, value
}) => getLinkForMedium(name)(value);
