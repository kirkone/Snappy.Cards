// Manual tree shaking, snowpack seems not to tree shake imports like
// import * as O from "fp-ts/Option";

import {
    chain as IOchain,
    map as IOmap
} from "fp-ts/es6/IO";
import {
    Apply as OApply,
    chain as Ochain,
    fromNullable as OfromNullable,
    fromPredicate as OfromPredicate,
    map as Omap,
} from "fp-ts/es6/Option";
import {
    lookup as Rlookup,
    mapWithIndex as RmapWithIndex,
} from "fp-ts/es6/Record";

// IO
export const IO = {
    map: IOmap,
    chain: IOchain
};

// Record
export const R = {
    mapWithIndex: RmapWithIndex,
    lookup: Rlookup,
};

// Option
export const O = {
    map: Omap,
    chain: Ochain,
    fromNullable: OfromNullable,
    fromPredicate: OfromPredicate,
    Apply: OApply,
};