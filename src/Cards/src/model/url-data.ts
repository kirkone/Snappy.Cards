import * as A from "fp-ts/Array";
import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as P from "fp-ts/Predicate";
import * as R from "fp-ts/Record";
import * as RE from "fp-ts/Reader";
import * as S from "fp-ts/string";
import * as URL_SP from "fp-ts-std/URLSearchParams";

import { compressToURI, decompressFromURI } from "lz-ts";
import { constant, flow, identity, pipe } from "fp-ts/function";
import { getUnionTypeMatcherStrict, sortStringEntriesByKey } from "../utils/utils";

import type { BrowserData } from "./browser-data";
import { Simplify } from "type-fest";
import { evolve } from "fp-ts/struct";
import { sequenceS } from "fp-ts/Apply";

const stringNotEmptyAsOption = O.fromPredicate(P.not(S.isEmpty));

// ============================================================================
// #region Image param helpers
// ============================================================================
export type ImageParamUnsplash =
    | "random"
    | (string & Readonly<{}>);

export type ImageParamLink = `http${string}`;

const isImageParamLink = (
    p: string
): p is ImageParamLink => p.startsWith("http");

export type ImageParam =
    | ImageParamUnsplash
    | ImageParamLink
    ;

type MatchImageParamOptions<R> = {
    onUnsplash: (imgParam: ImageParamUnsplash) => R;
    onUrl: (imgParam: ImageParamLink) => R;
};

export const matchImageParam = <R>({ onUnsplash, onUrl }: MatchImageParamOptions<R>) =>
    (ipv: ImageParam) =>
        isImageParamLink(ipv) ?
            onUrl(ipv) :
            onUnsplash(ipv);
//#endregion

// ============================================================================
// #region Decoder
// ============================================================================
const lookup: <A>(k: string) => (r: Record<string, A>) => O.Option<A> = R.lookup;
const nonEmptyStringCombinator = (
    f: (r: Record<string, string>) => O.Option<string>
) => flow(
    f,
    O.chain(stringNotEmptyAsOption)
);

const optionalString = (lookup)<string>;
const optionalImageParam = (lookup)<ImageParam>;

const optionalNonEmptyString = flow(optionalString, nonEmptyStringCombinator);
const optionalNonEmptyImageParam = flow(
    optionalImageParam,
    nonEmptyStringCombinator
);

const TUrlParameters = {
    name: optionalNonEmptyString("name"),
    job: optionalNonEmptyString("job"),
    phone: optionalNonEmptyString("phone"),
    mail: optionalNonEmptyString("mail"),
    web: optionalNonEmptyString("web"),
    sub: optionalNonEmptyString("sub"),

    twitter: optionalNonEmptyString("twt"),
    x: optionalNonEmptyString("x"),
    facebook: optionalNonEmptyString("fb"),
    youtube: optionalNonEmptyString("yt"),
    instagram: optionalNonEmptyString("in"),
    twitch: optionalNonEmptyString("twc"),
    github: optionalNonEmptyString("gh"),

    avatar: optionalNonEmptyImageParam("avatar"),
    background: optionalNonEmptyImageParam("background"),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StructReturns<T extends Record<string, (...a: any) => any>> = Simplify<{
    [K in keyof T]: ReturnType<T[K]>
}>;

export type UrlParameters = StructReturns<typeof TUrlParameters>;

//#endregion

// ============================================================================
// #region URL Parameters
// ============================================================================
// TODO: introduce iso for parameter <=> stringification
/**
 * @private exported only for testing
 */
export const getStableStringFromParameters = flow(
    identity<UrlParameters | UrlParametersCompressed>,
    R.filterMap(identity),
    R.toEntries,
    A.sort(sortStringEntriesByKey),
    // TODO: improve URL handling to return type of `URL_SP.fromString`
    URL_SP.fromTuples,
    URL_SP.toString
);

/**
 * @private exported only for testing
 */
export const getParametersFromString = flow(
    stringNotEmptyAsOption,
    O.map(flow(
        // TODO: improve URL handling to return type of `URL_SP.fromString`
        URL_SP.fromString,
        URL_SP.toTuples,
        R.fromEntries
    )),
);

const getParametersFromSearch = pipe(
    () => document.location.search.substring(1),
    IO.map(getParametersFromString)
);

const getParametersFromHash = pipe(
    // IO.of computes result only once and returns same result afterwards
    // so it was not used here
    () => document.location.hash.substring(1),
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

//#endregion

// ============================================================================
// #region compressed URL params
// ============================================================================
const TUrlParametersCompressed = {
    data: optionalNonEmptyString("data")
};

type UrlParametersCompressed = StructReturns<typeof TUrlParametersCompressed>;

const decompress = flow(
    decompressFromURI,
    O.fromNullable,
    O.chain(stringNotEmptyAsOption),
);

const decompressCompressedUrlParameter = flow(
    ({ data }: UrlParametersCompressed) => data,
    O.chain(decompress),
    O.chain(getParametersFromString),
);

const decodeCompressedUrlParameter = pipe(
    TUrlParametersCompressed,
    sequenceS(RE.Apply),
);

const getRecordFromCompressedUrlParameter = flow(
    decodeCompressedUrlParameter,
    decompressCompressedUrlParameter,
);

const compress = compressToURI;

export const compressToUrlParam = flow(
    getStableStringFromParameters,
    compress,
    data => ({ data: stringNotEmptyAsOption(data) }),
);
//#endregion

export type UrlDataOrigin = "FromCompressed" | "FromUrl";

export const UrlDataOriginAdt = {
    matchStrict: getUnionTypeMatcherStrict<UrlDataOrigin>(),
    of: {
        FromCompressed: "FromCompressed" as UrlDataOrigin,
        FromUrl: "FromUrl" as UrlDataOrigin,
    }
};

export const getParametersFromUrl = flow(
    getRecordFromUrl,
    urlParams => pipe(
        // try decompressing compressed url data
        getRecordFromCompressedUrlParameter(urlParams),
        O.map(urlParams => ({
            origin: UrlDataOriginAdt.of.FromCompressed,
            urlParams
        })),

        // fall back to decoding plain url parameters if decompress fails
        O.getOrElse(constant({
            origin: UrlDataOriginAdt.of.FromUrl,
            urlParams
        })),
    ),

    evolve({
        origin: identity<UrlDataOrigin>,
        urlParams: decodeUrlParameters
    }),
);

export const makeCurrentUrl = (location: BrowserData["location"]) => flow(
    getStableStringFromParameters,
    urlParamString => `${location.origin}#${urlParamString}`,
);
