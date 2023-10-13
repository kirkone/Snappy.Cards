import * as O from "fp-ts/Option";

import { getParametersFromString, getStableStringFromParameters } from "./url-data";

import { assert } from "../utils/riteway";
import { describe } from "vitest";

describe("getStableStringFromParameters", () => {
    assert({
        given: "an unordered list of url parameters",
        should: "output url parameters in a fixed order",
        actual: getStableStringFromParameters({
            sub: O.some("1sub"),
            mail: O.some("2mail"),
            web: O.some("3web"),
            x: O.some("4twitter"),
            instagram: O.some("5instagram"),
            github: O.some("6github"),
            twitter: O.some("7twitter"),
            name: O.some("8name"),
            avatar: O.none,
            youtube: O.some("9youtube"),
            phone: O.some("101234"),
            facebook: O.some("11facebook"),
            twitch: O.some("12twitch"),
            job: O.some("13job"),
            background: O.none,
        }),
        expected:
            "facebook=11facebook&github=6github&instagram=5instagram&job=13job" +
            "&mail=2mail&name=8name&phone=101234&sub=1sub&twitch=12twitch" +
            "&twitter=7twitter&web=3web&x=4twitter&youtube=9youtube"
    });

});

describe("getParametersFromString", () => {
    assert({
        given: "a string of url parameters",
        should: "parse to object",
        actual: getParametersFromString("facebook=11facebook&github=6github"),
        expected: O.some({
            github: "6github",
            facebook: "11facebook",
        })
    });

    assert({
        given: "an empty string of url parameters",
        should: "parse to none",
        actual: getParametersFromString(""),
        expected: O.none
    });
});
