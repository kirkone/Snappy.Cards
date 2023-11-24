import * as O from "fp-ts/Option";

import { AppData, appDataToUrlParams, getAppDataFromUrlParams } from "./app-data";

import { assert } from "../utils/riteway";
import { describe } from "vitest";
import { pipe } from "fp-ts/function";

describe("appData", () => {
    const testData: AppData = {
        name: O.some("name"),
        job: O.some("job"),
        sub: O.some("sub"),
        avatar: O.none,
        background: O.none,
        phone: O.some("phone"),
        mail: O.some("mail"),
        web: O.some("web"),
        twitter: O.some("twitter"),
        facebook: O.some("facebook"),
        youtube: O.some("youtube"),
        instagram: O.some("instagram"),
        twitch: O.some("twitch"),
        github: O.some("github"),
        linkedIn: O.some("linkedIn"),
        xing: O.some("xing"),
        paypal: O.some("paypal"),
        patreon: O.some("patreon"),
        pinterest: O.some("pinterest"),
        npm: O.some("npm"),
        soundcloud: O.some("soundcloud"),
        snapchat: O.some("snapchat"),
        steam: O.some("steam"),
        cpan: O.some("cpan"),

        config: {
            maximumDetailsVisible: O.none
        }
    };

    assert({
        given: "appData",
        should: "survive a round trip serializing to and from url data",
        actual: pipe(
            testData,
            appDataToUrlParams,
            getAppDataFromUrlParams
        ),
        expected: testData,
    });
});
