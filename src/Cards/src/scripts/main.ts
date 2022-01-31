import { IO, O, P, R, S } from "./fp";
import { flow, identity, pipe } from "fp-ts/es6/function";

import type { Endomorphism } from "fp-ts/es6/Endomorphism";
import type { IO as IOType } from "fp-ts/es6/IO";
import type { Option as OptionType } from "fp-ts/es6/Option";
import { makeQrCode } from "./qr/QRCode.js";
import { sequenceS } from "fp-ts/es6/Apply";

// ============================================================================
// Parameter handling
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
): OptionType<Record<string, string>> => pipe(
    input,
    O.fromPredicate(P.not(S.isEmpty)),
    O.map(flow(
        s => new URLSearchParams(s).entries(),
        // prevent usage of fromEntries overload, that uses any as return type
        params => Object.fromEntries(params),

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

const getParametersFromUrl: IOType<Record<string, string>> = pipe(
    getParametersFromSearch,
    IO.map(flow(
        O.alt(getParametersFromHash),
        O.getOrElse(() => ({}))
    )),
);

// ============================================================================
// Content Parameters
// ============================================================================
type ImageParams =
    | "random"
    | `http${string}`
    | (string & {});

type UrlParamDecoder = Endomorphism<OptionType<string>>;

const StringParamDecoder: UrlParamDecoder = identity;

type UnsplashParams = {
    width: number;
    height: number;
    params: Record<string, string>;
};

const ImageParamDecoder = (
    { width, height, params }: UnsplashParams
) => (
    input: OptionType<ImageParams>
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

const decodeParameters = (params: Record<string, string>) => pipe(
    urlParameters,
    R.mapWithIndex((name, decode) => pipe(
        params,
        R.lookup(name),
        decode,
    )),
);

// ============================================================================
// Rendering
// ============================================================================
const isInstanceOf = <CLS extends new (...args: any) => any>(
    Cls: CLS
) => (
    el: unknown
): el is InstanceType<CLS> => el instanceof Cls;

const getEl = flow(
    document.querySelector.bind(document),
    O.fromNullable,
    IO.of,
);

const getHtmlEl = flow(
    getEl,
    IO.map(O.chain(
        O.fromPredicate(isInstanceOf(HTMLElement))
    )),
);

const getImgEl = flow(
    getEl,
    IO.map(O.chain(
        O.fromPredicate(isInstanceOf(HTMLImageElement))
    ))
);

const getSvgEl = flow(
    getEl,
    IO.map(O.chain(
        O.fromPredicate(isInstanceOf(SVGElement))
    ))
);

const getAnchorEl = flow(
    getEl,
    IO.map(O.chain(
        O.fromPredicate(isInstanceOf(HTMLAnchorElement))
    ))
);

const sequenceIO = sequenceS(IO.Apply);
const sequenceO = sequenceS(O.Apply);

type RenderProps = Record<KnownUrlParameters, OptionType<string>>;

const render = ({
    avatar,
    background,
    ...data
}: RenderProps): IOType<void> => () => {
    pipe(
        sequenceIO({
            body: getHtmlEl("body"),
            background: IO.of(background)
        }),
        IO.map(sequenceO),
        IO.map(O.map(
            ({ body, background }) => body.style.backgroundImage = `url(${background})`
        )),
    )();

    pipe(
        sequenceIO({
            el: getHtmlEl("#avatar"),
            fillIn: getImgEl("#avatar > .fill-in"),
            src: IO.of(avatar)
        }),
        IO.map(sequenceO),
        IO.map(O.map(({ fillIn, src, el }) => {
            fillIn.src = src;
            el.classList.add("visible");
        })),
    )();

    pipe(
        data,
        R.mapWithIndex((key, value) => pipe(
            sequenceIO({
                el: getHtmlEl(`#${key}`),
                fillIn: getHtmlEl(`#${key} > .fill-in`),
                text: IO.of(value)
            }),
            IO.map(sequenceO),
            IO.map(O.map(({ fillIn, text, el }) => {
                fillIn.innerText = text;
                el.classList.add("visible");
            })),
            // run IO
            fillIn => fillIn()
        )),
    );
};

// ============================================================================
// VCard
// ============================================================================
type VCardFields = Exclude<
    KnownUrlParameters,
    | "sub"
    | "avatar"
    | "background"
>;

const VCardParamDecoder = (prefix: string) => (param: OptionType<string>) => pipe(
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

const renderVCard = (params: Record<VCardFields, OptionType<string>>) => pipe(
    params,
    R.foldMap(S.Ord)(S.Monoid)(O.getOrElse(() => "")),
    content => `BEGIN:VCARD\nVERSION:3.0\n${content}END:VCARD`
);

const vCardUrl = (vcardData: string) => pipe(
    new Blob([vcardData], { type: "text/vcard" }),
    URL.createObjectURL,
);

// ============================================================================
// Compose
// ============================================================================
const fillInValues = pipe(
    getParametersFromUrl,
    IO.map(decodeParameters),
    IO.chain(render)
);

const getVCardUrl = pipe(
    getParametersFromUrl,
    IO.map(flow(
        encodeVCardFields,
        renderVCard,
        vCardUrl,
    )),
);

window.addEventListener("DOMContentLoaded", () => {
    pipe(
        getHtmlEl("body > .content"),
        IO.map(O.map(
            content => content.style.visibility = "visible"
        )),
    )();

    pipe(
        sequenceIO({
            qrSvg: getSvgEl("#qr .qr-svg"),
            qrPath: getSvgEl("#qr .fill-in"),
        }),
        IO.map(sequenceO),
        IO.map(O.map(
            ({ qrSvg, qrPath }) => {
                const { sideLength, path } = makeQrCode("L", window.location.href);

                qrSvg.setAttribute("viewBox", `0 0 ${sideLength} ${sideLength}`);
                qrPath.setAttribute("d", path);
            }
        )),
    )();

    fillInValues();

    pipe(
        getAnchorEl("#vcarddownload"),
        IO.chain(flow(
            O.map(el => pipe(
                getVCardUrl,
                IO.map((vCardUrl) => el.href = vCardUrl),
            )),
            O.getOrElse(() => () => { })
        ))
    )();
});
