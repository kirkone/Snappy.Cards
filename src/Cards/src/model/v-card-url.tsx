import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as S from "fp-ts/string";
import { flow, pipe } from "fp-ts/function";
import type { UrlParameters } from "./url-data";

type VCardFields = {
    name: O.Option<string>;
    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
};

const vCardParamEncoder = (prefix: string) => (param: O.Option<string>) => pipe(
    param,
    O.map(p => `${prefix}${p}\n`)
);

const encodeVCardFields = (params: UrlParameters): VCardFields => pipe({
    name: pipe(params.name, vCardParamEncoder("N:")),
    phone: pipe(params.phone, vCardParamEncoder("TEL;TYPE=PREF:")),
    mail: pipe(params.mail, vCardParamEncoder("EMAIL;TYPE=PREF,INTERNET:")),
    web: pipe(params.name, vCardParamEncoder("URL:")),
});

const renderVCard = (params: VCardFields) => pipe(
    params,
    R.foldMap(S.Ord)(S.Monoid)(O.getOrElse(() => "")),
    content => `BEGIN:VCARD\nVERSION:3.0\n${content}END:VCARD`
);

const vCardUrl = (vcardData: string) => pipe(
    new Blob([vcardData], { type: "text/vcard" }),
    URL.createObjectURL
);

export const getVCardUrl = flow(
    encodeVCardFields,
    renderVCard,
    vCardUrl
);
