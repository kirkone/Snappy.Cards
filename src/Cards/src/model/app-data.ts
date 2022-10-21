import * as O from "fp-ts/Option";

import { ImageParamUnsplash, UrlParameters, matchImageParam } from "./url-data";
import { identity, pipe } from "fp-ts/function";

import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";

export type AppData = {
    name: O.Option<string>;
    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
    sub: O.Option<string>;
    avatar: O.Option<string>;
    background: O.Option<string>;
};

export const getAppData = (params: UrlParameters): AppData => ({
    name: params.name,
    phone: params.phone,
    mail: params.mail,
    web: params.web,
    sub: params.sub,
    avatar: pipe(
        params.avatar,
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
        params.background,
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
