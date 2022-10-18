// #region Imports

import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as styles from "./app.css";
import * as theme from "../theme/variables.css";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { Card, CardData } from "./card";
import { ElmishResult, Init, Update, cmd } from "@fun-ts/elmish";
import { UrlParameters, getParametersFromUrl } from "../model/url-data";

import { Footer } from "./footer";
import { Page } from "./page";
import type { PreactView } from "@fun-ts/elmish-preact";
import { QrCodeCard } from "./qr-code-card";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { getCardData } from "../model/card-data";
import { getVCardUrl } from "../model/v-card-url";
import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";
import { pipe } from "fp-ts/function";

// #endregion

// ============================================================================
// #region Model
// ============================================================================
export type Model = {
    appData: ADTType<typeof AppDataAdt>;
    currentUrl: ADTType<typeof CurrentUrlAdt>;
    vCardData: ADTType<typeof VCardDataAdt>;
};

export const init: Init<Model, Msg> = (): ElmishResult<Model, Msg> => [
    {
        appData: AppDataAdt.as.NotLoaded({}),
        currentUrl: CurrentUrlAdt.as.NotLoaded({}),
        vCardData: VCardDataAdt.as.NotLoaded({}),
    },
    cmd.batch(
        cmd.ofMsg(MsgAdt.of.GetUrlData({})),
        cmd.ofMsg(MsgAdt.of.GetCurrentUrl({})),
    )
];

// #endregion

// ============================================================================
// #region Messages
// ============================================================================
type GetUrlDataMsg = { type: "GetUrlData"; };
type GetUrlDataSucceededMsg = {
    type: "GetUrlDataSucceeded";
    data: UrlParameters;
};

type GetCurrentUrlMsg = { type: "GetCurrentUrl"; };
type GetCurrentUrlSucceededMsg = {
    type: "GetCurrentUrlSucceeded";
    location: {
        href: string;
    };
};

const MsgAdt = makeADT("type")({
    GetUrlData: ofType<GetUrlDataMsg>(),
    GetUrlDataSucceeded: ofType<GetUrlDataSucceededMsg>(),

    GetCurrentUrl: ofType<GetCurrentUrlMsg>(),
    GetCurrentUrlSucceeded: ofType<GetCurrentUrlSucceededMsg>(),
});

export type Msg = ADTType<typeof MsgAdt>;
// #endregion

// ============================================================================
// #region Update
// ============================================================================
export const update: Update<Model, Msg> = (model, msg) => pipe(
    msg,
    MsgAdt.matchStrict({
        GetUrlData: (): ElmishResult<Model, Msg> => [
            {
                ...model,
                appData: AppDataAdt.as.Loading({})
            },
            pipe(
                getParametersFromUrl,
                T.fromIO,
                cmd.OfTask.perform(data => MsgAdt.as.GetUrlDataSucceeded({ data }))
            )
        ],

        GetUrlDataSucceeded: ({ data }): ElmishResult<Model, Msg> => [
            {
                ...model,
                appData: pipe(
                    getCardData(data),
                    ({ background, ...card }) => AppDataAdt.as.Loaded({
                        card,
                        background,
                    })
                ),
                vCardData: VCardDataAdt.as.Loaded({
                    url: getVCardUrl(data)
                }),
            },
            cmd.none
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
                model.appData,
                O.fromPredicate(AppDataAdt.is.Loaded),
                O.chain(({ background }) => background),
                O.fold(
                    () => "",
                    (url) => `url(${url})`
                ),
            )
        })}
    >
        <Page>
            <CardView {...model.appData} />
        </Page>
        <Page>
            <QrCodeView {...model.currentUrl} />
        </Page>
        <Page align="end" fit="content">
            <Footer downloadUrl={model.vCardData} />
        </Page>
    </div>
);

// #endregion

// ============================================================================
// #region ADT for cardData
// ============================================================================
const AppDataAdt = makeRemoteResultADT<
    {
        card: CardData;
        background: O.Option<string>;
    }
>();

const CurrentUrlAdt = makeRemoteResultADT<{ href: string; }>();

export const VCardDataAdt = makeRemoteResultADT<{ url: string; }>();

// #endregion

// ============================================================================
// #region Views
// ============================================================================
const CardView = AppDataAdt.matchStrict({
    NotLoaded: () => <></>,
    Loading: () => <>⏳</>,
    Failure: () => <>⚠ An error occurred while getting data ⚠</>,
    Loaded: ({ card: data }) => <Card data={data} />
});

const QrCodeView = CurrentUrlAdt.matchStrict({
    NotLoaded: () => <></>,
    Loading: () => <>⏳</>,
    Failure: () => <>⚠ An error occurred while retrieving current URL ⚠</>,
    Loaded: ({ href }) => <QrCodeCard href={href} />
});
