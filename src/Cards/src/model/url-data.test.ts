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
            in: O.some("5instagram"),
            gh: O.some("6github"),
            name: O.some("8name"),
            avatar: O.none,
            yt: O.some("9youtube"),
            phone: O.some("101234"),
            fb: O.some("11facebook"),
            twc: O.some("12twitch"),
            job: O.some("13job"),
            background: O.none,
        }),
        expected:
            "fb=11facebook&gh=6github&in=5instagram&job=13job" +
            "&mail=2mail&name=8name&phone=101234&sub=1sub&twc=12twitch" +
            "&web=3web&x=4twitter&yt=9youtube"
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
