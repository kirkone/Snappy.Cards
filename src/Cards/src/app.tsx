// #region Imports

import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as P from "fp-ts/Predicate";
import * as R from "fp-ts/Record";
import * as S from "fp-ts/string";
import * as T from "fp-ts/Task";
import * as pageStyles from "./components/page.css"; //TODO
import * as styles from "./app.css";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { ElmishResult, Init, Update, cmd } from "@fun-ts/elmish";
import { flow, identity, pipe } from "fp-ts/function";

import type { Endomorphism } from "fp-ts/Endomorphism";
import type { FunctionalComponent } from "preact";
import { Page } from "./components/page";
import type { PreactView } from "@fun-ts/elmish-preact";
import { QrCode } from "./components/qr-code";
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
                appData: AppDataAdt.as.Loaded({
                    card: decodeCardData(data),
                    vCardUrl: getVCardUrl(data)
                })
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
    <div class={styles.app} style={{
        backgroundImage: pipe(
            model.appData,
            O.fromPredicate(AppDataAdt.is.Loaded),
            O.chain(({ card: data }) => data.background),
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

const decodeCardData = (params: Record<string, string>) => pipe(
    urlParameters,
    R.mapWithIndex((name, decode) => pipe(
        params,
        R.lookup(name),
        decode,
    )),
);

type CardData = ReturnType<typeof decodeCardData>;
// #endregion

// ============================================================================
// #region ADT for cardData
// ============================================================================
const AppDataAdt = makeRemoteResultADT<
    {
        card: CardData;
        vCardUrl: string;
    }
>();

const CurrentUrlAdt = makeRemoteResultADT<{ href: string; }>();

// #endregion

// ============================================================================
// #region Views
// ============================================================================
const CardLoaded: FunctionalComponent<{ data: CardData; }> = ({
    data
}) => <div class={styles.card}>
        {pipe(
            data.avatar,
            O.fold(
                () => <></>,
                (src) => <div class="image" id="avatar">
                    <img class="fill-in" src={src} alt="It's me." />
                </div>
            )
        )}

        <div class="detail">
            {pipe(
                data.name,
                O.fold(
                    () => <></>,
                    (name) => <div id="name">
                        <h3 class="fill-in">{name}</h3>
                    </div>
                )
            )}

            {pipe(
                data.phone,
                O.fold(
                    () => <></>,
                    (phone) => <div id="phone">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 16H11V18H13V16Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4ZM7 4H17V20H7L7 4Z" fill="currentColor" /></svg>
                        <span class="fill-in">{phone}</span>
                    </div>
                )
            )}

            {pipe(
                data.mail,
                O.fold(
                    () => <></>,
                    (mail) => <div id="mail">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z" fill="currentColor" /></svg>
                        <span class="fill-in">{mail}</span>
                    </div>
                )
            )}

            {pipe(
                data.web,
                O.fold(
                    () => <></>,
                    (web) => <div id="web">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM14.8055 18.4151C17.1228 17.4003 18.7847 15.1667 18.9806 12.525C18.1577 12.9738 17.12 13.3418 15.9371 13.598C15.7882 15.4676 15.3827 17.1371 14.8055 18.4151ZM9.1945 5.58487C7.24725 6.43766 5.76275 8.15106 5.22208 10.244C5.4537 10.4638 5.84813 10.7341 6.44832 11.0008C6.89715 11.2003 7.42053 11.3798 8.00537 11.5297C8.05853 9.20582 8.50349 7.11489 9.1945 5.58487ZM10.1006 13.9108C10.2573 15.3675 10.5852 16.6202 10.9992 17.5517C11.2932 18.2133 11.5916 18.6248 11.8218 18.8439C11.9037 18.9219 11.9629 18.9634 12 18.9848C12.0371 18.9634 12.0963 18.9219 12.1782 18.8439C12.4084 18.6248 12.7068 18.2133 13.0008 17.5517C13.4148 16.6202 13.7427 15.3675 13.8994 13.9108C13.2871 13.9692 12.6516 14 12 14C11.3484 14 10.7129 13.9692 10.1006 13.9108ZM8.06286 13.598C8.21176 15.4676 8.61729 17.1371 9.1945 18.4151C6.8772 17.4003 5.21525 15.1666 5.01939 12.525C5.84231 12.9738 6.88001 13.3418 8.06286 13.598ZM13.9997 11.8896C13.369 11.9609 12.6993 12 12 12C11.3008 12 10.631 11.9609 10.0003 11.8896C10.0135 9.66408 10.4229 7.74504 10.9992 6.44832C11.2932 5.78673 11.5916 5.37516 11.8218 5.15605C11.9037 5.07812 11.9629 5.03659 12 5.01516C12.0371 5.03659 12.0963 5.07812 12.1782 5.15605C12.4084 5.37516 12.7068 5.78673 13.0008 6.44832C13.5771 7.74504 13.9865 9.66408 13.9997 11.8896ZM15.9946 11.5297C15.9415 9.20582 15.4965 7.11489 14.8055 5.58487C16.7528 6.43766 18.2373 8.15107 18.7779 10.244C18.5463 10.4638 18.1519 10.7341 17.5517 11.0008C17.1029 11.2003 16.5795 11.3798 15.9946 11.5297Z" fill="currentColor" /></svg>
                        <span class="fill-in">{web}</span>
                    </div>
                )
            )}
        </div>

        {pipe(
            data.sub,
            O.fold(
                () => <></>,
                (sub) => <div class="sub" id="sub">
                    <span class="fill-in">{sub}</span>
                </div>
            )
        )}
    </div>;

const CardView = AppDataAdt.matchStrict({
    Failure: () => <>⚠ An error occurred while getting data ⚠</>,
    NotLoaded: () => <></>,
    Loading: () => <>⏳</>,
    Loaded: ({ card: data }) => <CardLoaded data={data} />
});

const QrCodeView = CurrentUrlAdt.matchStrict({
    Failure: () => <>⚠ An error occurred while retrieving current URL ⚠</>,
    NotLoaded: () => <></>,
    Loading: () => <>⏳</>,
    Loaded: ({ href }) => <div class="qr" id="qr">
        <QrCode border={5} text={href} className={styles.qrCode} />
    </div>
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
