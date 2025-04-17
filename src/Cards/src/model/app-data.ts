import * as O from "fp-ts/Option";

import { ADTType, makeADT, ofType } from "@morphic-ts/adt";
import { FunctionN, constant, pipe } from "fp-ts/function";
import { ImageParamLink, ImageParamSnappy, UrlParameters, matchImageParam } from "./url-data";

import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";

type ImageDataSnappy = { type: "Snappy"; name: ImageParamSnappy; url: string; };
type ImageDataUrl = { type: "Url", url: ImageParamLink; };

export const ImageDataAdt = makeADT("type")({
    Snappy: ofType<ImageDataSnappy>(),
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
    signal: O.Option<string>;
    telegram: O.Option<string>;

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
    sgn,
    tel,

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
    signal: sgn,
    telegram: tel,

    twitter: pipe(
        x,
        O.alt(constant(twt))
    ),

    avatar: pipe(
        avatar,
        O.map(
            matchImageParam({
                onSnappy: name => ImageDataAdt.of.Snappy({
                    name,
                    url: makeSnappyUrl({ name })
                }),

                onUrl: url => ImageDataAdt.of.Url({ url }),
            })
        ),
    ),

    background: pipe(
        background,
        O.map(matchImageParam<ImageData>({
            onSnappy: name => ImageDataAdt.of.Snappy({
                name,
                url: makeSnappyUrl({ name })
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
    signal,
    telegram,

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
    sgn: signal,
    tel: telegram,

    avatar: pipe(
        avatar,
        O.map(ImageDataAdt.matchStrict({
            Snappy: ({ name }) => name,
            Url: ({ url }) => url,
        })),
    ),

    background: pipe(
        background,
        O.map(ImageDataAdt.matchStrict({
            Snappy: ({ name }) => name,
            Url: ({ url }) => url,
        })),
    ),

    cfgMaxDetails: config.maximumDetailsVisible,

    ...rest,
});

type SnappyApiParams = {
    name: ImageParamSnappy;
};

const makeSnappyUrl = (
    { name }: SnappyApiParams
) => `${import.meta.env.BASE_URL}images/wallpapers/${encodeURIComponent(name.replace(/^snappy:/, ""))}`;

export const AppDataAdt = makeRemoteResultADT<AppData>();
