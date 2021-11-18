import {
  Apply as IOApply,
  chain as IOchain,
  map as IOmap,
  of as IOof
} from "../vendor/pkg/fp-ts/es6/IO.js";
import {
  Apply as OApply,
  chain as Ochain,
  fromNullable as OfromNullable,
  fromPredicate as OfromPredicate,
  map as Omap
} from "../vendor/pkg/fp-ts/es6/Option.js";
import {
  lookup as Rlookup,
  mapWithIndex as RmapWithIndex
} from "../vendor/pkg/fp-ts/es6/Record.js";
export const IO = {
  map: IOmap,
  chain: IOchain,
  of: IOof,
  Apply: IOApply
};
export const R = {
  mapWithIndex: RmapWithIndex,
  lookup: Rlookup
};
export const O = {
  map: Omap,
  chain: Ochain,
  fromNullable: OfromNullable,
  fromPredicate: OfromPredicate,
  Apply: OApply
};
