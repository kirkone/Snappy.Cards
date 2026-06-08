import * as O from "fp-ts/Option";

import { assert } from "../utils/riteway";
import { describe } from "vitest";
import { encodeVCardFields, getVCardUrl } from "./v-card-url";

describe("vCard generation", () => {
    const input = {
        name: O.some("Guybrush Threepwood"),
        job: O.some("Mighty Pirate"),
        phone: O.some("+49 123 4567890"),
        mail: O.some("captain@example.com"),
        web: O.some("https://example.com"),
        twitter: O.some("sparrow"),
        facebook: O.some("mirror"),
        youtube: O.some("cinema"),
        instagram: O.some("snapshot"),
        twitch: O.some("broadcast"),
        github: O.some("octopus"),
        linkedIn: O.some("ladder"),
        xing: O.some("compass"),
        paypal: O.some("wallet"),
        patreon: O.some("patron"),
        pinterest: O.some("collage"),
        npm: O.some("parcel"),
        soundcloud: O.some("thunder"),
        snapchat: O.some("phantom"),
        steam: O.some("vapor"),
        cpan: O.some("camel"),
        signal: O.some("beacon"),
        telegram: O.some("courier"),
        avatarBase64: O.none,
    };

    assert({
        given: "app data with all contact and social media fields",
        should: "encode every field with its matching vCard prefix",
        actual: encodeVCardFields(input),
        expected: {
            name: O.some("N:Guybrush Threepwood\n"),
            job: O.some("TITLE:Mighty Pirate\n"),
            phone: O.some("TEL;TYPE=PREF:+49 123 4567890\n"),
            mail: O.some("EMAIL;TYPE=PREF,INTERNET:captain@example.com\n"),
            web: O.some("URL:https://example.com\n"),
            avatar: O.none,
            twitter: O.some("X-TWITTER:sparrow\n"),
            facebook: O.some("X-FACEBOOK:mirror\n"),
            youtube: O.some("X-YOUTUBE:cinema\n"),
            instagram: O.some("X-INSTAGRAM:snapshot\n"),
            twitch: O.some("X-TWITCH:broadcast\n"),
            github: O.some("X-GITHUB:octopus\n"),
            linkedIn: O.some("X-LINKEDIN:ladder\n"),
            xing: O.some("X-XING:compass\n"),
            paypal: O.some("X-PAYPAL:wallet\n"),
            patreon: O.some("X-PATREON:patron\n"),
            pinterest: O.some("X-PINTEREST:collage\n"),
            npm: O.some("X-NPM:parcel\n"),
            soundcloud: O.some("X-SOUNDCLOUD:thunder\n"),
            snapchat: O.some("X-SNAPCHAT:phantom\n"),
            steam: O.some("X-STEAM:vapor\n"),
            cpan: O.some("X-CPAN:camel\n"),
            signal: O.some("X-SIGNAL:beacon\n"),
            telegram: O.some("X-TELEGRAM:courier\n"),
        },
    });

    assert({
        given: "app data passed to getVCardUrl",
        should: "produce a blob URL",
        actual: getVCardUrl(input).slice(0, 5),
        expected: "blob:",
    });
});