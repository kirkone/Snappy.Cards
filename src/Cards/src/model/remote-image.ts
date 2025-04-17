import * as S from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";

import { asBlobTE, funFetch } from "@fun-ts/fetch";

import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";
import { memoizeTaskK } from "../utils/utils";
import { pipe } from "fp-ts/function";

const convertBlobToBase64P = (blob: Blob) => new Promise<string>(
    (resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
            reject(reader.error ?? new Error("FileReader Error"));
        };
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

const downloadImage = (remoteUrl: string) => pipe(
    funFetch(remoteUrl),
    asBlobTE,
    TE.chainW(blob => pipe(
        convertBlobToBase64(blob),
        TE.map(base64Url => ({
            objectUrl: URL.createObjectURL(blob),
            remoteUrl,
            base64: {
                type: blob.type,
                content: base64Url.replace(/^data:[^,]+,/, ""),
                url: base64Url
            }
        })),
    )),
    TE.mapLeft(e => ({ ...e, remoteUrl }))
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
    { objectUrl: string; remoteUrl: string; },
    { error: DownloadImageError; }
>();
