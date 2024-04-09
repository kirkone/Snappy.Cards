// #region Imports

import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as styles from "./app.css";
import * as theme from "../theme/variables.css";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { AppData, AppDataAdt, appDataToUrlParams, getAppDataFromUrlParams } from "../model/app-data";
import { Base64Data, DownloadImageError, RemoteImageAdt, downloadImageCached } from "../model/remote-image";
import { BrowserData, BrowserDataAdt, getBrowserData, shareUrl } from "../model/browser-data";
import { ElmishResult, Init, Subscribe, Update, cmd } from "@fun-ts/elmish";
import { ErrorIcon, LoaderIcon } from "./icons";
import { UrlDataOrigin, UrlDataOriginAdt, compressToUrlParam, getParametersFromUrl, getStableStringFromParameters, makeCurrentUrl } from "../model/url-data";
import { VCardDataAdt, getVCardUrl, vCardFieldsFromAppData, vCardFieldsFromAppDataLoaded } from "../model/v-card-url";
import { constant, identity, pipe } from "fp-ts/function";
import { getWindowTitleFromAppData, setWindowTitle } from "../model/window-title";

import { Card } from "./card";
import { SharePage } from "./share-page";
import type { FunctionComponent } from "preact";
import { Page } from "./page";
import type { PreactView } from "@fun-ts/elmish-preact";
import { QrCodeCard } from "./qr-code-card";
import type { Simplify } from "type-fest";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { evolve } from "fp-ts/struct";
import { pick } from "fp-ts-std/Struct";
import { Menu } from "./menu";
import * as Routes from "../model/routes";
import { CSSVarScrollPercentage } from "./menu.css";

// #endregion

// ============================================================================
// #region ADTs
// ============================================================================
// #endregion

// ============================================================================
// #region Model
// ============================================================================
export type Model = {
    appData: ADTType<typeof AppDataAdt>;
    vCardData: ADTType<typeof VCardDataAdt>;
    backgroundImage: ADTType<typeof RemoteImageAdt>;
    avatarImage: ADTType<typeof RemoteImageAdt>;
    browserData: ADTType<typeof BrowserDataAdt>;

    cardExpanded: boolean;
};

export const init: Init<Model, Msg> = (): ElmishResult<Model, Msg> => [
    {
        appData: AppDataAdt.as.NotLoaded({}),
        vCardData: VCardDataAdt.as.NotLoaded({}),
        backgroundImage: VCardDataAdt.as.NotLoaded({}),
        avatarImage: VCardDataAdt.as.NotLoaded({}),
        browserData: BrowserDataAdt.as.NotLoaded({}),
        cardExpanded: false,
    },
    cmd.batch(
        cmd.ofMsg(MsgAdt.of.GetAppData({})),
        cmd.ofMsg(MsgAdt.of.GetBrowserData({})),
    )
];

// #endregion

// ============================================================================
// #region Messages
// ============================================================================
type GetAppDataMsg = { type: "GetAppData"; };
type GetAppDataSucceededMsg = {
    type: "GetAppDataSucceeded";
    origin: UrlDataOrigin;
    data: AppData;
};

type GetBackgroundImageMsg = { type: "GetBackgroundImage"; };
type GetBackgroundImageSucceededMsg = {
    type: "GetBackgroundImageSucceeded";
    objectUrl: string;
    remoteUrl: string;
    base64: Base64Data;
};
type GetBackgroundImageFailedMsg = {
    type: "GetBackgroundImageFailed";
    error: DownloadImageError;
};
type GetAvatarImageMsg = { type: "GetAvatarImage"; };
type GetAvatarImageSucceededMsg = {
    type: "GetAvatarImageSucceeded";
    objectUrl: string;
    remoteUrl: string;
    base64: Base64Data;
};
type GetAvatarImageFailedMsg = {
    type: "GetAvatarImageFailed";
    error: DownloadImageError;
};

type GetBrowserDataMsg = { type: "GetBrowserData"; };
type GetBrowserDataSucceededMsg = {
    type: "GetBrowserDataSucceeded";
    data: BrowserData;
};

type HashChangedMsg = { type: "HashChanged"; };

type ToggleCardExpansionMsg = { type: "ToggleCardExpansion"; };

type ShareMsg = { type: "Share"; };

type NavigateMsg = { type: "Navigate"; route: Routes.Route; };

const MsgAdt = makeADT("type")({
    GetAppData: ofType<GetAppDataMsg>(),
    GetAppDataSucceeded: ofType<GetAppDataSucceededMsg>(),

    GetBrowserData: ofType<GetBrowserDataMsg>(),
    GetBrowserDataSucceeded: ofType<GetBrowserDataSucceededMsg>(),

    GetBackgroundImage: ofType<GetBackgroundImageMsg>(),
    GetBackgroundImageSucceeded: ofType<GetBackgroundImageSucceededMsg>(),
    GetBackgroundImageFailed: ofType<GetBackgroundImageFailedMsg>(),

    GetAvatarImage: ofType<GetAvatarImageMsg>(),
    GetAvatarImageSucceeded: ofType<GetAvatarImageSucceededMsg>(),
    GetAvatarImageFailed: ofType<GetAvatarImageFailedMsg>(),

    HashChanged: ofType<HashChangedMsg>(),

    ToggleCardExpansion: ofType<ToggleCardExpansionMsg>(),

    Share: ofType<ShareMsg>(),

    Navigate: ofType<NavigateMsg>(),
});

export type Msg = ADTType<typeof MsgAdt>;
// #endregion

// ============================================================================
// #region Subscription
// ============================================================================
export const sub: Subscribe<Model, Msg> = (_) => cmd.ofSub(
    dispatch => window.addEventListener("hashchange", () => {
        dispatch(MsgAdt.as.HashChanged({}));
    })
);

export const pushUrlParametersCmd = (hash: string) =>
    cmd.ofSub<never>(() => location.hash = hash);

//#endregion

// ============================================================================
// #region Update
// ============================================================================
export const update: Update<Model, Msg> = (model, msg) => pipe(
    msg,
    MsgAdt.matchStrict({
        GetAppData: (): ElmishResult<Model, Msg> => [
            {
                ...model,
                appData: AppDataAdt.as.Loading({})
            },
            pipe(
                getParametersFromUrl,
                IO.map(evolve({
                    origin: identity<UrlDataOrigin>,
                    urlParams: getAppDataFromUrlParams
                })),
                T.fromIO,
                cmd.OfTask.perform(
                    ({ origin, urlParams }) => MsgAdt.as.GetAppDataSucceeded({
                        origin,
                        data: urlParams,
                    })
                )
            )
        ],

        GetAppDataSucceeded: ({ origin, data }): ElmishResult<Model, Msg> => [
            {
                ...model,
                appData: AppDataAdt.as.Loaded(data),
                vCardData:
                    O.isSome(data.avatar) ?
                        VCardDataAdt.as.Loading({}) :
                        pipe(
                            data,
                            vCardFieldsFromAppData,
                            d => getVCardUrl({ ...d, avatarBase64: O.none }),
                            url => VCardDataAdt.as.Loaded({ url }),
                        ),
            },
            pipe(
                origin,
                UrlDataOriginAdt.matchStrict({
                    FromUrl: constant(
                        cmd.batch(
                            cmd.ofMsg(MsgAdt.of.GetBackgroundImage({})),
                            cmd.ofMsg(MsgAdt.of.GetAvatarImage({})),
                            cmd.ofSub(pipe(
                                getWindowTitleFromAppData(data),
                                setWindowTitle
                            ))
                        )
                    ),
                    FromCompressed: constant(pipe(
                        data,
                        appDataToUrlParams,
                        getStableStringFromParameters,
                        pushUrlParametersCmd,
                    ))
                })
            )

        ],

        GetBrowserData: (): ElmishResult<Model, Msg> => [
            {
                ...model,
                browserData: BrowserDataAdt.as.Loading({})
            },
            cmd.ofSub(dispatch => dispatch(
                MsgAdt.as.GetBrowserDataSucceeded({
                    data: getBrowserData()
                })
            ))
        ],

        GetBrowserDataSucceeded: ({ data }): ElmishResult<Model, Msg> => [
            {
                ...model,
                browserData: BrowserDataAdt.as.Loaded(data)
            },
            cmd.none
        ],

        GetBackgroundImage: () => pipe(
            model.appData,
            O.fromPredicate(AppDataAdt.is.Loaded),
            O.chain(d => d.background),
            O.fold(
                () => [model, cmd.none],
                remoteUrl => [
                    {
                        ...model,
                        backgroundImage: RemoteImageAdt.of.Loading({}),
                    },
                    pipe(
                        downloadImageCached(remoteUrl.url),
                        cmd.OfTaskEither.either(
                            error => MsgAdt.as.GetBackgroundImageFailed({ error }),
                            MsgAdt.as.GetBackgroundImageSucceeded
                        )
                    )
                ]
            )
        ),

        GetBackgroundImageSucceeded: (imageData) => [
            {
                ...model,
                backgroundImage: RemoteImageAdt.as.Loaded(imageData)
            },
            cmd.none
        ],

        GetBackgroundImageFailed: ({ error }) => [
            {
                ...model,
                backgroundImage: RemoteImageAdt.as.Failure({ error })
            },
            cmd.none
        ],

        GetAvatarImage: () => pipe(
            model.appData,
            O.fromPredicate(AppDataAdt.is.Loaded),
            O.chain(d => d.avatar),
            O.fold(
                () => [
                    {
                        ...model,
                    },
                    cmd.none
                ],

                remoteUrl => [
                    {
                        ...model,
                        avatarImage: RemoteImageAdt.of.Loading({}),
                    },
                    pipe(
                        downloadImageCached(remoteUrl.url),
                        cmd.OfTaskEither.either(
                            error => MsgAdt.of.GetAvatarImageFailed({ error }),
                            MsgAdt.of.GetAvatarImageSucceeded
                        )
                    )
                ]
            )
        ),

        GetAvatarImageSucceeded: (imageData) => [
            {
                ...model,
                avatarImage: RemoteImageAdt.as.Loaded(imageData),

                vCardData: pipe(
                    model.appData,
                    vCardFieldsFromAppDataLoaded,
                    O.fold(
                        () => VCardDataAdt.of.NotLoaded({}),
                        data => VCardDataAdt.of.Loaded({
                            url: getVCardUrl({
                                ...data,
                                avatarBase64: O.some(imageData.base64)
                            })
                        })
                    ),
                ),
            },
            cmd.none
        ],

        GetAvatarImageFailed: ({ error }) => [
            {
                ...model,
                avatarImage: RemoteImageAdt.as.Failure({ error }),

                vCardData: pipe(
                    model.appData,
                    vCardFieldsFromAppDataLoaded,
                    O.fold(
                        () => VCardDataAdt.of.NotLoaded({}),
                        data => VCardDataAdt.of.Loaded({
                            url: getVCardUrl({
                                ...data,
                                avatarBase64: O.none
                            })
                        })
                    ),
                ),
            },
            cmd.none
        ],

        HashChanged: init,

        ToggleCardExpansion: () => [
            {
                ...model,
                cardExpanded: !model.cardExpanded,
            },
            cmd.none
        ],

        Share: () => {
            const { appData, browserData } = model;

            return [
                model,

                AppDataAdt.is.Loaded(appData) && BrowserDataAdt.is.Loaded(browserData) ?
                    cmd.ofSub(() => {
                        pipe(
                            appData,
                            appDataToUrlParams,
                            compressToUrlParam,
                            makeCurrentUrl(browserData.location),
                            shareUrl(browserData.shareMode)
                        );
                    }) :
                    cmd.none
            ];
        },

        Navigate: ({ route }) => [
            model,
            Routes.goToRouteCmd(route)
        ]
    })
);
// #endregion

// ============================================================================
// #region View
// ============================================================================
export const view: PreactView<Model, Msg> = (dispatch, model) => (
    <div class={`${styles.app} ${theme.defaultTheme}`}
        onScroll={synchronizeScrollToCSS}
        style={assignInlineVars({
            [styles.CssVarBackground]: pipe(
                model.backgroundImage,
                O.fromPredicate(RemoteImageAdt.is.Loaded),
                O.fold(
                    () => "",
                    ({ objectUrl }) => `url(${objectUrl})`
                ),
            )
        })}
    >
        <Page route={Routes.of.Card}>
            <CardView
                appData={model.appData}
                avatar={model.avatarImage}
                expanded={model.cardExpanded}
                onExpandClick={() => dispatch(MsgAdt.as.ToggleCardExpansion({}))}
            />
        </Page>
        <Page route={Routes.of.Qr}>
            <QrCodeView
                appData={model.appData}
                browserData={model.browserData}
            />
        </Page>
        <Page route={Routes.of.Share}>
            <SharePage
                downloadUrl={model.vCardData}
                name={pipe(
                    model.appData,
                    O.fromPredicate(AppDataAdt.is.Loaded),
                    O.chain(d => d.name)
                )}
                browserData={model.browserData}
                onShareClick={() => dispatch(MsgAdt.as.Share({}))}
            />
        </Page>
        <Menu
            browserData={model.browserData}
            onClick={route => dispatch(MsgAdt.as.Navigate({ route }))}
        />
    </div>
);

// #endregion

// ============================================================================
// #region Views
// ============================================================================
type CardViewProps = Simplify<
    & {
        appData: ADTType<typeof AppDataAdt>;
        avatar: ADTType<typeof RemoteImageAdt>;
    }
    & Pick<Parameters<typeof Card>[0], "expanded" | "onExpandClick">
>;

const CardView: FunctionComponent<CardViewProps> = ({
    appData,
    avatar,
    expanded,

    onExpandClick
}) => pipe(
    appData,
    AppDataAdt.matchStrict({
        NotLoaded: () => <></>,
        Loading: () => <LoaderIcon />,
        Failure: () => <>
            <ErrorIcon /> An error occurred while getting data
        </>,
        Loaded: appData => <Card
            expanded={expanded}
            maximumDetailsVisible={appData.config.maximumDetailsVisible}
            onExpandClick={onExpandClick}

            data={pipe(
                appData,
                pick([
                    "name" as const,
                    "job" as const,
                    "phone" as const,
                    "mail" as const,
                    "web" as const,
                    "sub" as const,
                    "twitter" as const,
                    "facebook" as const,
                    "youtube" as const,
                    "instagram" as const,
                    "twitch" as const,
                    "github" as const,
                    "linkedIn" as const,
                    "xing" as const,
                    "paypal" as const,
                    "patreon" as const,
                    "pinterest" as const,
                    "npm" as const,
                    "soundcloud" as const,
                    "snapchat" as const,
                    "steam" as const,
                    "cpan" as const,
                ]),
            )}
            avatar={avatar}
        />
    })
);

type QrCodeViewProps = {
    appData: ADTType<typeof AppDataAdt>;
    browserData: ADTType<typeof BrowserDataAdt>;
};

const QrCodeView: FunctionComponent<QrCodeViewProps> = ({
    appData,
    browserData,
}) => pipe(
    browserData,
    BrowserDataAdt.matchStrict({
        NotLoaded: () => <></>,

        Loading: () => <LoaderIcon />,

        Failure: () => <>
            <ErrorIcon /> An error occurred while loading browser information.
        </>,

        Loaded: ({ location }) => pipe(
            appData,
            AppDataAdt.matchStrict({
                NotLoaded: () => <></>,
                Loading: () => <LoaderIcon />,
                Failure: () => <>
                    <ErrorIcon /> An error occurred while loading application data.
                </>,
                Loaded: (appDataLoaded) => (
                    <QrCodeCard
                        href={pipe(
                            appDataLoaded,
                            appDataToUrlParams,
                            makeCurrentUrl(location)
                        )}
                    />
                )
            })
        ),
    })
);
//#endregion

// ============================================================================
// #region Helper replacing scroll-timeline with CSS Variable
// ============================================================================
const CSSVarScrollPercentageName = pipe(
    CSSVarScrollPercentage,
    s => s.replace(/var\(([^)]+)\)/, (_, name) => name)
);

const synchronizeScrollToCSS = ({
    currentTarget: ct
}: JSX.TargetedUIEvent<HTMLDivElement>) => {
    const scrolled = ct.scrollHeight > ct.scrollWidth ?
        ct.scrollTop / (ct.scrollHeight - window.innerHeight) :
        ct.scrollLeft / (ct.scrollWidth - window.innerWidth);

    const scrollPercent = `${scrolled * 100}%`;

    // bypass render loop of preact, not to trigger reconciliation
    // 60 times a second only for animation purposes
    requestAnimationFrame(() => {
        document
            .documentElement
            .style
            .setProperty(CSSVarScrollPercentageName, scrollPercent);
    });
};
//#endregion
