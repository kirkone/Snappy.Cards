// Manual tree shaking, snowpack seems not to tree shake imports like
// import * as O from "fp-ts/Option";

import {
    Apply as IOApply,
    chain as IOchain,
    map as IOmap,
    of as IOof,
} from "fp-ts/es6/IO";
import {
    Apply as OApply,
    chain as Ochain,
    fromNullable as OfromNullable,
    fromPredicate as OfromPredicate,
    getOrElse as OgetOrElse,
    map as Omap,
    none as Onone,
} from "fp-ts/es6/Option";
import {
    foldMap as RfoldMap,
    lookup as Rlookup,
    map as Rmap,
    mapWithIndex as RmapWithIndex
} from "fp-ts/es6/Record";
import {
    Monoid as SMonoid,
    Ord as SOrd,
} from "fp-ts/es6/string";

// IO
export const IO = {
    map: IOmap,
    chain: IOchain,
    of: IOof,
    Apply: IOApply
};

// Record
export const R = {
    mapWithIndex: RmapWithIndex,
    map: Rmap,
    foldMap: RfoldMap,
    lookup: Rlookup,
};

// Option
export const O = {
    map: Omap,
    chain: Ochain,
    fromNullable: OfromNullable,
    fromPredicate: OfromPredicate,
    Apply: OApply,
    none: Onone,
    getOrElse: OgetOrElse,
};

export const S = {
    Ord: SOrd,
    Monoid: SMonoid
};
