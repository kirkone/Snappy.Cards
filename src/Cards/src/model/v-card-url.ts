import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as S from "fp-ts/string";

import { AppData, AppDataAdt } from "./app-data";
import { flow, pipe } from "fp-ts/function";

import type { Base64Data } from "./remote-image";
import { makeRemoteResultADT } from "@fun-ts/remote-result-adt";
import { pick } from "fp-ts-std/Struct";

type VCardFields = {
    name: O.Option<string>;
    job: O.Option<string>;
    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
    avatar: O.Option<string>;
};

const vCardParamEncoder = (prefix: string) => O.map<string, string>(
    param => `${prefix}${param}\n`
);

const vCardImageEncoder = O.map<Base64Data, string>(
    d => `PHOTO;ENCODING=BASE64;TYPE=${d.type.toUpperCase()}:${d.content}\n\n`
);

type VCardInput =
    & Pick<AppData, "name" | "phone" | "mail" | "web" | "job">
    & { avatarBase64: O.Option<Base64Data>; };

const encodeVCardFields = (params: VCardInput): VCardFields => ({
    name: pipe(params.name, vCardParamEncoder("N:")),
    job: pipe(params.job, vCardParamEncoder("TITLE:")),
    phone: pipe(params.phone, vCardParamEncoder("TEL;TYPE=PREF:")),
    mail: pipe(params.mail, vCardParamEncoder("EMAIL;TYPE=PREF,INTERNET:")),
    web: pipe(params.web, vCardParamEncoder("URL:")),
    avatar: pipe(params.avatarBase64, vCardImageEncoder),
});

const renderVCard = (params: VCardFields) => pipe(
    params,
    R.foldMap(S.Ord)(S.Monoid)(O.getOrElse(() => "")),
    content => `BEGIN:VCARD\nVERSION:3.0\n${content}END:VCARD`
);

const vCardUrl = (vcardData: string) => pipe(
    new Blob([vcardData], { type: "text/vcard" }),
    URL.createObjectURL.bind(URL)
);

export const getVCardUrl = flow(
    encodeVCardFields,
    renderVCard,
    vCardUrl
);

export const VCardDataAdt = makeRemoteResultADT<{ url: string; }>();

export const vCardFieldsFromAppData = (a: AppData) => pipe(
    a,
    pick(["name", "phone", "mail", "web", "job"]),
);

export const vCardFieldsFromAppDataLoaded = flow(
    O.fromPredicate(AppDataAdt.is.Loaded),
    O.map(vCardFieldsFromAppData),
);
