// #region Imports

import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as styles from "./app.css";
import * as theme from "../theme/variables.css";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { AppData, AppDataAdt, getAppData } from "../model/app-data";
import { Base64Data, DownloadImageError, RemoteImageAdt, downloadImageCached } from "../model/remote-image";
import { ElmishResult, Init, Subscribe, Update, cmd } from "@fun-ts/elmish";
import { ErrorIcon, LoaderIcon } from "./icons";
import { VCardDataAdt, getVCardUrl, vCardFieldsFromAppData, vCardFieldsFromAppDataLoaded } from "../model/v-card-url";

import { Card } from "./card";
import { Footer } from "./footer";
import type { FunctionComponent } from "preact";
import { Page } from "./page";
import type { PreactView } from "@fun-ts/elmish-preact";
import { QrCodeCard } from "./qr-code-card";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { getParametersFromUrl } from "../model/url-data";
import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";
import { pick } from "fp-ts-std/Struct";
import { pipe } from "fp-ts/function";

// #endregion

// ============================================================================
// #region ADTs
// ============================================================================
const CurrentUrlAdt = makeRemoteResultADT<{ href: string; }>();
// #endregion

// ============================================================================
// #region Model
// ============================================================================
export type Model = {
    appData: ADTType<typeof AppDataAdt>;
    currentUrl: ADTType<typeof CurrentUrlAdt>;
    vCardData: ADTType<typeof VCardDataAdt>;
    backgroundImage: ADTType<typeof RemoteImageAdt>;
    avatarImage: ADTType<typeof RemoteImageAdt>;
};

export const init: Init<Model, Msg> = (): ElmishResult<Model, Msg> => [
    {
        appData: AppDataAdt.as.NotLoaded({}),
        currentUrl: CurrentUrlAdt.as.NotLoaded({}),
        vCardData: VCardDataAdt.as.NotLoaded({}),
        backgroundImage: VCardDataAdt.as.NotLoaded({}),
        avatarImage: VCardDataAdt.as.NotLoaded({}),
    },
    cmd.batch(
        cmd.ofMsg(MsgAdt.of.GetAppData({})),
        cmd.ofMsg(MsgAdt.of.GetCurrentUrl({})),
    )
];

// #endregion

// ============================================================================
// #region Messages
// ============================================================================
type GetAppDataMsg = { type: "GetAppData"; };
type GetAppDataSucceededMsg = {
    type: "GetAppDataSucceeded";
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

type GetCurrentUrlMsg = { type: "GetCurrentUrl"; };
type GetCurrentUrlSucceededMsg = {
    type: "GetCurrentUrlSucceeded";
    location: {
        href: string;
    };
};

type HashChangedMsg = { type: "HashChanged"; };

const MsgAdt = makeADT("type")({
    GetAppData: ofType<GetAppDataMsg>(),
    GetAppDataSucceeded: ofType<GetAppDataSucceededMsg>(),

    GetCurrentUrl: ofType<GetCurrentUrlMsg>(),
    GetCurrentUrlSucceeded: ofType<GetCurrentUrlSucceededMsg>(),

    GetBackgroundImage: ofType<GetBackgroundImageMsg>(),
    GetBackgroundImageSucceeded: ofType<GetBackgroundImageSucceededMsg>(),
    GetBackgroundImageFailed: ofType<GetBackgroundImageFailedMsg>(),

    GetAvatarImage: ofType<GetAvatarImageMsg>(),
    GetAvatarImageSucceeded: ofType<GetAvatarImageSucceededMsg>(),
    GetAvatarImageFailed: ofType<GetAvatarImageFailedMsg>(),

    HashChanged: ofType<HashChangedMsg>(),
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
                IO.map(getAppData),
                T.fromIO,
                cmd.OfTask.perform(data => MsgAdt.as.GetAppDataSucceeded({ data }))
            )
        ],

        GetAppDataSucceeded: ({ data }): ElmishResult<Model, Msg> => [
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
            cmd.batch(
                cmd.ofMsg(MsgAdt.of.GetBackgroundImage({})),
                cmd.ofMsg(MsgAdt.of.GetAvatarImage({})),
            )
        ],

        GetCurrentUrl: (): ElmishResult<Model, Msg> => [
            {
                ...model,
                currentUrl: CurrentUrlAdt.as.Loading({})
            },
            cmd.ofSub(dispatch => dispatch(
                MsgAdt.as.GetCurrentUrlSucceeded({
                    location: {
                        href: window.location.href
                    }
                })
            ))
        ],

        GetCurrentUrlSucceeded: ({ location }): ElmishResult<Model, Msg> => [
            {
                ...model,
                currentUrl: CurrentUrlAdt.as.Loaded(location)
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
                        downloadImageCached(remoteUrl),
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
                        downloadImageCached(remoteUrl),
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

        HashChanged: init
    })
);
// #endregion

// ============================================================================
// #region View
// ============================================================================
export const view: PreactView<Model, Msg> = (_dispatch, model) => (
    <div class={`${styles.app} ${theme.defaultTheme}`}
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
        <Page>
            <CardView
                appData={model.appData}
                avatar={model.avatarImage}
            />
        </Page>
        <Page>
            <QrCodeView {...model.currentUrl} />
        </Page>
        <Page align="end" fit="content">
            <Footer
                downloadUrl={model.vCardData}
                name={pipe(
                    model.appData,
                    O.fromPredicate(AppDataAdt.is.Loaded),
                    O.chain(d => d.name)
                )}
            />
        </Page>
    </div>
);

// #endregion

// ============================================================================
// #region Views
// ============================================================================
type CardViewProps = {
    appData: ADTType<typeof AppDataAdt>;
    avatar: ADTType<typeof RemoteImageAdt>;
};

const CardView: FunctionComponent<CardViewProps> = ({
    appData,
    avatar,
}) => pipe(
    appData,
    AppDataAdt.matchStrict({
        NotLoaded: () => <></>,
        Loading: () => <LoaderIcon />,
        Failure: () => <>
            <ErrorIcon /> An error occurred while getting data
        </>,
        Loaded: appData => <Card
            data={pipe(
                appData,
                pick([
                    "name",
                    "phone",
                    "mail",
                    "web",
                    "sub",
                    "twitter",
                    "facebook",
                    "youtube",
                    "instagram",
                    "twitch",
                    "github",
                ]),
            )}
            avatar={avatar}
        />
    })
);

const QrCodeView = CurrentUrlAdt.matchStrict({
    NotLoaded: () => <></>,
    Loading: () => <LoaderIcon />,
    Failure: () => <>
        <ErrorIcon /> An error occurred while retrieving current URL
    </>,
    Loaded: ({ href }) => <QrCodeCard href={href} />
});

//#endregion
