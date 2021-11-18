import { IO, O, R } from "./fp";
import { flow, identity, pipe } from "fp-ts/es6/function";

import type { Endomorphism } from "fp-ts/es6/Endomorphism";
import type { IO as IOType } from "fp-ts/es6/IO";
import type { Option as OptionType } from "fp-ts/es6/Option";
import QRCodeStyling from "qr-code-styling";
import { sequenceS } from "fp-ts/es6/Apply";

type KnownUrlParameters =
    | "name"
    | "phone"
    | "mail"
    | "web"
    | "sub"
    | "avatar"
    | "background";

// ============================================================================
// URL Parameters
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
    O.fromNullable
);

const getHtmlEl = flow(
    getEl,
    O.chain(O.fromPredicate(isInstanceOf(HTMLElement)))
);

const getImgEl = flow(
    getEl,
    O.chain(O.fromPredicate(isInstanceOf(HTMLImageElement)))
);

const sequenceO = sequenceS(O.Apply);

type RenderProps = Record<KnownUrlParameters, OptionType<string>>;

const render = ({
    avatar,
    background,
    ...data
}: RenderProps): IOType<void> => () => {
    pipe(
        sequenceO({
            body: getHtmlEl("body"),
            background: background
        }),
        O.map(({ body, background }) => body.style.backgroundImage = `url(${background})`),
    );

    pipe(
        sequenceO({
            el: getHtmlEl("#avatar"),
            fillIn: getImgEl("#avatar > .fill-in"),
            src: avatar
        }),
        O.map(({ fillIn, src, el }) => {
            fillIn.src = src;
            el.classList.add("visible");
        }),
    );

    pipe(
        data,
        R.mapWithIndex((key, value) => pipe(
            sequenceO({
                el: getHtmlEl(`#${key}`),
                fillIn: getHtmlEl(`#${key} > .fill-in`),
                text: value
            }),
            O.map(({ fillIn, text, el }) => {
                fillIn.innerText = text;
                el.classList.add("visible");
            }),
        )),
    );
};

// ============================================================================
// Compose
// ============================================================================
const getParametersFromSearch: IOType<Record<string, string>> = () => pipe(
    new URLSearchParams(document.location.search.substring(1)).entries(),
    Object.fromEntries,
);

const fillInValues = pipe(
    getParametersFromSearch,
    IO.map(decodeParameters),
    IO.chain(render)
);

const qrCode = new QRCodeStyling({
    width: 600,
    height: 600,
    type: "canvas",
    data: window.location.href,
    image: "",
    margin: 10,
    qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "L"
    },
    dotsOptions: {
        color: "#000000",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#ffffffaa",
    },
    cornersSquareOptions: {
        color: "#000000",
        type: "extra-rounded",
    },
    cornersDotOptions: {
        color: "#000000",
        type: "dot",
    }
});

window.addEventListener("DOMContentLoaded", () => {
    pipe(
        getHtmlEl("body > .content"),
        O.map(content => content.style.visibility = "visible"),
    );

    pipe(
        getHtmlEl("#qr"),
        O.map(qr => qrCode.append(qr))
    );

    fillInValues();
});
