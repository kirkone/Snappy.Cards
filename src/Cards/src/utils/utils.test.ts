import * as A from "fp-ts/Array";

import { pipe, tuple } from "fp-ts/function";

import { assert } from "./riteway";
import { describe } from "vitest";
import { sortStringEntriesByKey } from "./utils";

describe("sortStringEntriesByKey", () => {
    assert({
        given: "an array of entries",
        should: "be sorted by key (first in tuple)",
        actual: pipe(
            [
                tuple("b", 4),
                tuple("z", 3),
                tuple("a", 1),
            ],
            A.sort(sortStringEntriesByKey)
        ),
        expected: [
            tuple("a", 1),
            tuple("b", 4),
            tuple("z", 3)
        ],
    });
});
