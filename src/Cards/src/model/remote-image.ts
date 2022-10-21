import * as S from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";

import { asBlobTE, funFetch } from "@fun-ts/fetch";

import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";
import { memoizeTaskK } from "../components/utils";
import { pipe } from "fp-ts/function";

const convertBlobToBase64P = (blob: Blob) => new Promise<string>(
    (resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => {
            typeof reader.result === "string" ?
                resolve(reader.result) :
                reject(new Error("FileReader Result is not a String."));
        };
        reader.readAsDataURL(blob);
    }
);

export const convertBlobToBase64 = TE.tryCatchK(
    convertBlobToBase64P,
    error => ({ type: "ConversionError" as const, error: error as Error })
);

const downloadImage = (url: string) => pipe(
    funFetch(url),
    asBlobTE,
    TE.chainW(blob => pipe(
        convertBlobToBase64(blob),
        TE.map(content => ({
            url: URL.createObjectURL(blob),
            base64: {
                type: blob.type,
                content: content.replace(/^data:[^,]+,/, ""),
            }
        }))
    ))
);

export type Base64Data = {
    type: string;
    content: string;
};

export type DownloadImageError =
    ReturnType<(typeof downloadImage)> extends TE.TaskEither<infer E, unknown> ?
    E :
    never;

export const downloadImageCached = memoizeTaskK(S.Eq)(downloadImage);

export const RemoteImageAdt = makeRemoteResultADT<
    { url: string; },
    { e: DownloadImageError; }
>();
