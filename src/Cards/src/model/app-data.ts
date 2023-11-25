import * as O from "fp-ts/Option";
import * as URL_SP from "fp-ts-std/URLSearchParams";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { FunctionN, constant, flow, pipe } from "fp-ts/function";
import { ImageParamUnsplash, UrlParameters, matchImageParam } from "./url-data";

import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";
import { prepend } from "fp-ts-std/String";

type ImageDataUnsplash = { type: "Unsplash"; id: string; url: string; };
type ImageDataUrl = { type: "Url", url: string; };

export const ImageDataAdt = makeADT("type")({
    Unsplash: ofType<ImageDataUnsplash>(),
    Url: ofType<ImageDataUrl>(),
});

type ImageData = ADTType<typeof ImageDataAdt>;

export type AppData = {
    name: O.Option<string>;
    job: O.Option<string>;
    sub: O.Option<string>;
    avatar: O.Option<ImageData>;
    background: O.Option<ImageData>;
    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
    twitter: O.Option<string>;
    facebook: O.Option<string>;
    youtube: O.Option<string>;
    instagram: O.Option<string>;
    twitch: O.Option<string>;
    github: O.Option<string>;
    linkedIn: O.Option<string>;
    xing: O.Option<string>;
    paypal: O.Option<string>;
    patreon: O.Option<string>;
    pinterest: O.Option<string>;
    npm: O.Option<string>;
    soundcloud: O.Option<string>;
    snapchat: O.Option<string>;
    steam: O.Option<string>;
    cpan: O.Option<string>;

    config: {
        maximumDetailsVisible: O.Option<number>;
    };
};

export const getAppDataFromUrlParams: FunctionN<[UrlParameters], AppData> = ({
    avatar,
    background,
    twt,
    x,
    fb,
    yt,
    in: ins,
    twc,
    gh,
    li,
    xi,
    pp,
    pa,
    pi,
    npm,
    sc,
    sn,
    st,
    mc,

    cfgMaxDetails,

    ...rest
}) => ({
    ...rest,

    facebook: fb,
    youtube: yt,
    instagram: ins,
    twitch: twc,
    github: gh,
    linkedIn: li,
    xing: xi,
    paypal: pp,
    patreon: pa,
    pinterest: pi,
    npm: npm,
    soundcloud: sc,
    snapchat: sn,
    steam: st,
    cpan: mc,

    twitter: pipe(
        x,
        O.alt(constant(twt))
    ),

    avatar: pipe(
        avatar,
        O.map(
            matchImageParam({
                onUnsplash: id => ImageDataAdt.of.Unsplash({
                    id,
                    url: makeUnsplashUrl({
                        id,
                        width: 100,
                        height: 100,
                        params: URL_SP.fromTuples([["face", ""]])
                    })
                }),

                onUrl: url => ImageDataAdt.of.Url({ url }),
            })
        ),
    ),

    background: pipe(
        background,
        O.map(matchImageParam<ImageData>({
            onUnsplash: id => ImageDataAdt.of.Unsplash({
                id,
                url: makeUnsplashUrl({
                    id,
                    width: 1000,
                    height: 1000,
                    params: URL_SP.fromTuples([["blur", ""]])
                })
            }),

            onUrl: url => ImageDataAdt.of.Url({ url }),
        }))
    ),

    config: {
        maximumDetailsVisible: cfgMaxDetails
    }
});

export const appDataToUrlParams: FunctionN<[AppData], UrlParameters> = ({
    avatar,
    background,
    twitter,
    facebook,
    youtube,
    instagram,
    twitch,
    github,
    linkedIn,
    xing,
    paypal,
    patreon,
    pinterest,
    npm,
    soundcloud,
    snapchat,
    steam,
    cpan,

    config,

    ...rest
}) => ({
    x: twitter,

    // deprecated, mapped to x
    twt: O.none,

    fb: facebook,
    yt: youtube,
    in: instagram,
    twc: twitch,
    gh: github,
    li: linkedIn,
    xi: xing,
    pp: paypal,
    pa: patreon,
    pi: pinterest,
    npm: npm,
    sc: soundcloud,
    sn: snapchat,
    st: steam,
    mc: cpan,

    avatar: pipe(
        avatar,
        O.map(ImageDataAdt.matchStrict({
            Unsplash: ({ id }) => id,
            Url: ({ url }) => url,
        })),
    ),

    background: pipe(
        background,
        O.map(ImageDataAdt.matchStrict({
            Unsplash: ({ id }) => id,
            Url: ({ url }) => url,
        })),
    ),

    cfgMaxDetails: config.maximumDetailsVisible,

    ...rest,
});

type UnsplashApiParams = {
    id: ImageParamUnsplash;
    width: number;
    height: number;
    params?: URLSearchParams;
};

const makeUnsplashUrl = (
    { id, width, height, params }: UnsplashApiParams
) => pipe(
    O.fromNullable(params),
    O.fold(
        constant(""),
        flow(
            URL_SP.toString,
            prepend("?")
        ),
    ),
    qs => `https://source.unsplash.com/${encodeURIComponent(id)}/${width}x${height}${qs}`
);

export const AppDataAdt = makeRemoteResultADT<AppData>();
