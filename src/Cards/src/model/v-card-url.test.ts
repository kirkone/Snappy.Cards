import * as O from "fp-ts/Option";

import { AppData } from "./app-data";
import { assert } from "../utils/riteway";
import { describe } from "vitest";
import { getVCardUrl, encodeVCardFields } from "./v-card-url";

describe("vCard generation", () => {
    const testData: Pick<AppData, "name" | "job" | "phone" | "mail" | "web" | "twitter" | "facebook" | "github" | "linkedIn" | "instagram" | "youtube" | "twitch" | "xing" | "paypal" | "patreon" | "pinterest" | "npm" | "soundcloud" | "snapchat" | "steam" | "cpan" | "signal" | "telegram"> = {
        name: O.some("John Doe"),
        job: O.some("Software Developer"),
        phone: O.some("+1234567890"),
        mail: O.some("john@example.com"),
        web: O.some("https://example.com"),
        twitter: O.some("johndoe"),
        facebook: O.some("john.doe"),
        github: O.some("johndoe"),
        linkedIn: O.some("johndoe"),
        instagram: O.some("johndoe"),
        youtube: O.some("johndoe"),
        twitch: O.some("johndoe"),
        xing: O.some("johndoe"),
        paypal: O.some("johndoe"),
        patreon: O.some("johndoe"),
        pinterest: O.some("johndoe"),
        npm: O.some("johndoe"),
        soundcloud: O.some("johndoe"),
        snapchat: O.some("johndoe"),
        steam: O.some("johndoe"),
        cpan: O.some("johndoe"),
        signal: O.some("johndoe"),
        telegram: O.some("johndoe"),
    };

    const vCardUrl = getVCardUrl({
        ...testData,
        avatarBase64: O.none
    });

    // Test that the function doesn't throw and returns a valid URL
    assert({
        given: "app data with social media fields",
        should: "generate a vCard URL",
        actual: typeof vCardUrl,
        expected: "string",
    });

    assert({
        given: "app data with social media fields",
        should: "generate a blob URL",
        actual: vCardUrl.startsWith("blob:"),
        expected: true,
    });

    // Test that encodeVCardFields includes X- prefixed fields
    const vCardFields = encodeVCardFields({
        ...testData,
        avatarBase64: O.none
    });

    assert({
        given: "vCard fields with twitter handle",
        should: "include X-TWITTER field",
        actual: O.isSome(vCardFields.twitter),
        expected: true,
    });

    assert({
        given: "vCard fields with github handle",
        should: "include X-GITHUB field",
        actual: O.isSome(vCardFields.github),
        expected: true,
    });

    // Test specific field content
    assert({
        given: "vCard fields with twitter handle 'johndoe'",
        should: "contain X-TWITTER:johndoe",
        actual: O.getOrElse(() => "")(vCardFields.twitter),
        expected: "X-TWITTER:johndoe\n",
    });

    assert({
        given: "vCard fields with github handle 'johndoe'",
        should: "contain X-GITHUB:johndoe",
        actual: O.getOrElse(() => "")(vCardFields.github),
        expected: "X-GITHUB:johndoe\n",
    });
});