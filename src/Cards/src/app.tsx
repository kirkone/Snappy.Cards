// #region Imports

import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as P from "fp-ts/Predicate";
import * as R from "fp-ts/Record";
import * as S from "fp-ts/string";
import * as T from "fp-ts/Task";
import * as pageStyles from "./components/page.css"; //TODO
import * as styles from "./app.css";
import * as theme from "./theme/variables.css";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { Card, CardData } from "./components/card";
import { ElmishResult, Init, Update, cmd } from "@fun-ts/elmish";
import { flow, identity, pipe } from "fp-ts/function";

import type { Endomorphism } from "fp-ts/Endomorphism";
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
};

export const init: Init<Model, Msg> = (): ElmishResult<Model, Msg> => [
    {
        appData: AppDataAdt.as.NotLoaded({}),
        currentUrl: CurrentUrlAdt.as.NotLoaded({}),
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
                        vCardUrl: getVCardUrl(data)
                    })
                )
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

        {/* TODO: war mal div.foot */}
        <footer className={pageStyles.footer}>
            <div>
                <a href="https://github.com/kirkone/Snappy.Cards">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 10.9794C11 10.4271 11.4477 9.97937 12 9.97937C12.5523 9.97937 13 10.4271 13 10.9794V16.9794C13 17.5317 12.5523 17.9794 12 17.9794C11.4477 17.9794 11 17.5317 11 16.9794V10.9794Z" fill="currentColor" /><path d="M12 6.05115C11.4477 6.05115 11 6.49886 11 7.05115C11 7.60343 11.4477 8.05115 12 8.05115C12.5523 8.05115 13 7.60343 13 7.05115C13 6.49886 12.5523 6.05115 12 6.05115Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="currentColor" /></svg>
                </a>
                {pipe(
                    model.appData,
                    O.fromPredicate(AppDataAdt.is.Loaded),
                    O.map(({ vCardUrl }) => vCardUrl),
                    O.fold(
                        () => <></>,
                        (vCardUrl) => <a id="vcarddownload" download="SnappyCard.vcf" rel="noopener" src={vCardUrl}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.1578L16.2428 8.91501L17.657 10.3292L12.0001 15.9861L6.34326 10.3292L7.75748 8.91501L11 12.1575V5Z" fill="currentColor" /><path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor" /></svg>
                        </a>
                    )
                )}
            </div>
        </footer>
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
        vCardUrl: string;
    }
>();

const CurrentUrlAdt = makeRemoteResultADT<{ href: string; }>();

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
