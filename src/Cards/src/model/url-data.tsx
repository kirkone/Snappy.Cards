import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as P from "fp-ts/Predicate";
import * as R from "fp-ts/Record";
import * as RE from "fp-ts/Reader";
import * as S from "fp-ts/string";

import { flow, pipe } from "fp-ts/function";

import { sequenceS } from "fp-ts/Apply";

const stringNotEmptyAsOption = O.fromPredicate(P.not(S.isEmpty));

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
    phone: optionalNonEmptyString("phone"),
    mail: optionalNonEmptyString("mail"),
    web: optionalNonEmptyString("web"),
    sub: optionalNonEmptyString("sub"),
    avatar: optionalNonEmptyImageParam("avatar"),
    background: optionalNonEmptyImageParam("background"),
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
const getParametersFromString = flow(
    stringNotEmptyAsOption,
    O.map(flow(
        s => [...new URLSearchParams(s).entries()],
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

export const getParametersFromUrl = flow(
    getRecordFromUrl,
    decodeUrlParameters
);

//#endregion
