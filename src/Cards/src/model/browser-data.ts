import * as IO from "fp-ts/IO";

import { ConditionalPick, Simplify } from "type-fest";

import { getUnionTypeMatcherStrict } from "../utils/utils";
import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";
import { pick } from "fp-ts-std/Struct";
import { pipe } from "fp-ts/function";

export type BrowserData = {
    osMode: "ios" | "other",
    shareMode: "share" | "clipboard" | "none",
    location: Simplify<ConditionalPick<Location, string>>;
};

export const getBrowserData: IO.IO<BrowserData> = () => {
    const n = navigator;

    return ({
        osMode: /(Mac|iPhone|iPod|iPad)/i.test(n.platform) ? "ios" : "other",

        shareMode:
            !!n.canShare && !!n.share && n.canShare({ url: location.toString() }) ? "share" :
                !!n.clipboard && !!n.clipboard.writeText ? "clipboard" :
                    "none",

        location: pipe(
            location,
            pick([
                "hash",
                "host",
                "hostname",
                "href",
                "origin",
                "pathname",
                "port",
                "protocol",
                "search",
            ])
        )
    });
};

export const BrowserDataAdt = makeRemoteResultADT<BrowserData>();

export const matchOsMode = getUnionTypeMatcherStrict<BrowserData["osMode"]>();
export const matchShareMode = getUnionTypeMatcherStrict<BrowserData["shareMode"]>();

export const shareUrl = matchShareMode({
    share: () => (url: string) => { navigator.share({ url }); },
    clipboard: () => (url: string) => { navigator.clipboard.writeText(url); },
    none: () => () => { },
});
