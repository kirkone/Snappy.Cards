import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as P from "fp-ts/Predicate";
import * as R from "fp-ts/Record";
import * as RE from "fp-ts/Reader";
import * as S from "fp-ts/string";

import { flow, pipe } from "fp-ts/function";

import { sequenceS } from "fp-ts/Apply";

// ============================================================================
// #region Image param helpers
// ============================================================================
export type ImageParamUnsplash =
    | "random"
    | (string & {});

export type ImageParamLink = `http${string}`;

const isImageParamLink = (
    p: string
): p is ImageParamLink => p.startsWith("http");

export type ImageParam =
    | ImageParamUnsplash
    | ImageParamLink
    ;

interface matchImageParamOptions {
    onUnsplash: (imgParam: ImageParamUnsplash) => string;
    onUrl: (imgParam: ImageParamLink) => string;
}

export const matchImageParam = ({ onUnsplash, onUrl }: matchImageParamOptions) =>
    (ipv: ImageParam) =>
        isImageParamLink(ipv) ?
            onUrl(ipv) :
            onUnsplash(ipv);
//#endregion

// ============================================================================
// #region Decoder
// ============================================================================
const lookup: <A>(k: string) => (r: Record<string, A>) => O.Option<A> = R.lookup;
const optionalString = (lookup)<string>;
const optionalImageParam = (lookup)<ImageParam>;

const TUrlParameters = {
    name: optionalString("name"),
    phone: optionalString("phone"),
    mail: optionalString("mail"),
    web: optionalString("web"),
    sub: optionalString("sub"),
    avatar: optionalImageParam("avatar"),
    background: optionalImageParam("background"),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StructReturns<T extends Record<string, (...a: any) => any>> = {
    [K in keyof T]: ReturnType<T[K]>
};

export type UrlParameters = StructReturns<typeof TUrlParameters>;

//#endregion

// ============================================================================
// #region URL Parameters
// ============================================================================
const getParametersFromString = (
    input: string
) => pipe(
    input,
    O.fromPredicate(P.not(S.isEmpty)),
    O.map(flow(
        s => [...new URLSearchParams(s).entries()],
        R.fromEntries
    )),
);

const getParametersFromSearch = pipe(
    IO.of(document.location.search.substring(1)),
    IO.map(getParametersFromString)
);

const getParametersFromHash = pipe(
    IO.of(document.location.hash.substring(1)),
    IO.map(getParametersFromString)
);

const getRecordFromUrl = pipe(
    getParametersFromSearch,
    IO.map(flow(
        O.alt(getParametersFromHash),
        O.getOrElse(() => ({} as Record<string, string>))
    )),
);

const decodeUrlParameters = pipe(
    TUrlParameters,
    sequenceS(RE.Apply),
);

export const getParametersFromUrl = flow(
    getRecordFromUrl,
    decodeUrlParameters
);

//#endregion
