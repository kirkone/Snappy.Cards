// #region Imports

import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as P from "fp-ts/Predicate";
import * as R from "fp-ts/Record";
import * as S from "fp-ts/string";
import * as T from "fp-ts/Task";
import * as styles from "./app.css";
import * as theme from "./theme/variables.css";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { Card, CardData } from "./components/card";
import { ElmishResult, Init, Update, cmd } from "@fun-ts/elmish";
import { flow, identity, pipe } from "fp-ts/function";

import type { Endomorphism } from "fp-ts/Endomorphism";
import { Footer } from "./components/footer";
import { Page } from "./components/page";
import type { PreactView } from "@fun-ts/elmish-preact";
import { QrCodeCard } from "./components/qr-code-card";
import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";

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
type GetUrlDataSucceededMsg = { type: "GetUrlDataSucceeded"; data: UrlData; };

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
                    decodeUrlParameters(data),
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
    <div class={`${styles.app} ${theme.defaultTheme}`} style={{
        backgroundImage: pipe(
            model.appData,
            O.fromPredicate(AppDataAdt.is.Loaded),
            O.chain(({ background }) => background),
            O.fold(
                () => "none",
                (url) => `url(${url})`
            ),
        )
    }}>
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
// #region Data from URL
// ============================================================================
type KnownUrlParameters =
    | "name"
    | "phone"
    | "mail"
    | "web"
    | "sub"
    | "avatar"
    | "background";

const getParametersFromInput = (
    input: string
) => pipe(
    input,
    O.fromPredicate(P.not(S.isEmpty)),
    O.map(flow(
        s => [...new URLSearchParams(s).entries()],
        R.fromEntries,
    ))
);

const getParametersFromSearch = pipe(
    IO.of(document.location.search.substring(1)),
    IO.map(getParametersFromInput),
);

const getParametersFromHash = pipe(
    IO.of(document.location.hash.substring(1)),
    IO.map(getParametersFromInput),
);

const getParametersFromUrl = pipe(
    getParametersFromSearch,
    IO.map(flow(
        O.alt(getParametersFromHash),
        O.getOrElseW((): Record<string, string> => ({}))
    )),
);

type UrlData = ReturnType<typeof getParametersFromUrl>;
// #endregion

// ============================================================================
// #region Decode parameters
// ============================================================================
type ImageParams =
    | "random"
    | `http${string}`
    | (string & {});

type UrlParamDecoder = Endomorphism<O.Option<string>>;

const StringParamDecoder: UrlParamDecoder = identity;

type UnsplashParams = {
    width: number;
    height: number;
    params: Record<string, string>;
};

const ImageParamDecoder = (
    { width, height, params }: UnsplashParams
) => (
    input: O.Option<ImageParams>
) => pipe(
    input,
    O.map(i => i.startsWith("http") ?
        i :
        `https://source.unsplash.com/${i}/${width}x${height}?${new URLSearchParams(params)}`
    ),
);

const urlParameters: Record<KnownUrlParameters, UrlParamDecoder> = {
    name: StringParamDecoder,
    phone: StringParamDecoder,
    mail: StringParamDecoder,
    web: StringParamDecoder,
    sub: StringParamDecoder,
    avatar: ImageParamDecoder({
        width: 100,
        height: 100,
        params: { face: "" }
    }),
    background: ImageParamDecoder({
        width: 1000,
        height: 1000,
        params: { blur: "" }
    }),
};

const decodeUrlParameters = (
    params: Record<string, string>
): Record<KnownUrlParameters, O.Option<string>> => pipe(
    urlParameters,
    R.mapWithIndex((name, decode) => pipe(
        params,
        R.lookup(name),
        decode,
    )),
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

// #endregion

// ============================================================================
// #region VCard
// ============================================================================
type VCardFields = Exclude<
    KnownUrlParameters,
    | "sub"
    | "avatar"
    | "background"
>;

const VCardParamDecoder = (prefix: string) => (param: O.Option<string>) => pipe(
    param,
    O.map(p => `${prefix}${p}\n`)
);

const vCardParameters: Record<VCardFields, UrlParamDecoder> = {
    name: VCardParamDecoder("N:"),
    phone: VCardParamDecoder("TEL;TYPE=PREF:"),
    mail: VCardParamDecoder("EMAIL;TYPE=PREF,INTERNET:"),
    web: VCardParamDecoder("URL:"),
};

const encodeVCardFields = (params: Record<string, string>) => pipe(
    vCardParameters,
    R.mapWithIndex((name, decode) => pipe(
        params,
        R.lookup(name),
        decode,
    )),
);

const renderVCard = (params: Record<VCardFields, O.Option<string>>) => pipe(
    params,
    R.foldMap(S.Ord)(S.Monoid)(O.getOrElse(() => "")),
    content => `BEGIN:VCARD\nVERSION:3.0\n${content}END:VCARD`
);

const vCardUrl = (vcardData: string) => pipe(
    new Blob([vcardData], { type: "text/vcard" }),
    URL.createObjectURL,
);

const getVCardUrl = flow(
    encodeVCardFields,
    renderVCard,
    vCardUrl,
);
// #endregion
