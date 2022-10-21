import type { Eq } from "fp-ts/Eq";
import type { Task } from "fp-ts/Task";
import { flow } from "fp-ts/function";
import { memoize as memoizeF } from "fp-ts-std/Function";
import { memoize as memoizeIO } from "fp-ts-std/IO";

export const memoizeTask = memoizeIO as <A>(f: Task<A>) => Task<A>;

export const memoizeTaskK =
    <A,>(eq: Eq<A>) =>
        <B,>(f: (x: A) => Task<B>) =>
            memoizeF(eq)(flow(f, memoizeTask));
