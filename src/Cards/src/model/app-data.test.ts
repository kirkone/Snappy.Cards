import * as O from "fp-ts/Option";

import { AppData, appDataToUrlParams, getAppDataFromUrlParams } from "./app-data";

import { assert } from "../utils/riteway";
import { describe } from "vitest";
import { pipe } from "fp-ts/function";

describe("appData should survive a round trip to url params", () => {
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
    };

    assert({
        given: "appData",
        should: "survive appDataToUrlParams => getAppDataFromUrlParams",
        actual: pipe(
            testData,
            appDataToUrlParams,
            getAppDataFromUrlParams
        ),
        expected: testData,
    });
});
