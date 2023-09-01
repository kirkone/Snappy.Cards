import * as O from "fp-ts/Option";

import { FunctionN, identity, pipe } from "fp-ts/function";
import { ImageParamUnsplash, UrlParameters, matchImageParam } from "./url-data";

import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";

export type AppData = {
    name: O.Option<string>;
    job: O.Option<string>;
    sub: O.Option<string>;
    avatar: O.Option<string>;
    background: O.Option<string>;
    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
    twitter: O.Option<string>;
    facebook: O.Option<string>;
    youtube: O.Option<string>;
    instagram: O.Option<string>;
    twitch: O.Option<string>;
    github: O.Option<string>;
};

export const getAppData: FunctionN<[UrlParameters], AppData> = ({
    avatar,
    background,
    ...rest
}) => ({
    ...rest,
    avatar: pipe(
        avatar,
        O.map(matchImageParam({
            onUnsplash: makeUnsplashUrl({
                width: 100,
                height: 100,
                params: { face: "" }
            }),
            onUrl: identity,
        }))
    ),
    background: pipe(
        background,
        O.map(matchImageParam({
            onUnsplash: makeUnsplashUrl({
                width: 1000,
                height: 1000,
                params: { blur: "" }
            }),
            onUrl: identity,
        }))
    ),
});

type UnsplashApiParams = {
    width: number;
    height: number;
    params: Record<string, string>;
};

const makeUnsplashUrl = (
    { width, height, params }: UnsplashApiParams
) => (
    id: ImageParamUnsplash
) => pipe(
    new URLSearchParams(params),
    ps => `https://source.unsplash.com/${id}/${width}x${height}?${ps}`
);

export const AppDataAdt = makeRemoteResultADT<AppData>();
