import * as ORD from "fp-ts/Ord";
import * as S from "fp-ts/string";

import { curry2, memoize as memoizeF } from "fp-ts-std/Function";
import { flip, flow, pipe } from "fp-ts/function";

import type { Eq } from "fp-ts/Eq";
import { Simplify } from "type-fest";
import type { Task } from "fp-ts/Task";
import filenamify from "filenamify";
import { memoize as memoizeIO } from "fp-ts-std/IO";

export const memoizeTask = memoizeIO as <A>(f: Task<A>) => Task<A>;

export const memoizeTaskK =
    <A,>(eq: Eq<A>) =>
        <B,>(f: (x: A) => Task<B>) =>
            memoizeF(eq)(flow(f, memoizeTask));

export const sanitizeFilename = flip(curry2(filenamify))({
    replacement: "_",
    maxLength: 200
});

type UnaryFn<P, R> = (shape: P) => R;
type DiscriminateUnionType<T extends number | string> = { [K in T]: K };

type PatternUnionType<
    R,
    T extends string | number,
    DUT = DiscriminateUnionType<T>,
> = {
        [K in keyof DUT]: UnaryFn<DUT[K], R>;
    };

export const getUnionTypeMatcherStrict = <
    T extends string | number,
>() => <R>(pattern: Simplify<PatternUnionType<R, T>>): ((shape: T) => R) => {
    // eslint-disable-next-line functional/prefer-tacit
    return shape => pattern[shape](shape);
};

export const sortStringEntriesByKey = pipe(
    S.Ord,
    ORD.contramap(([key,]: [string, unknown]) => key),
);
