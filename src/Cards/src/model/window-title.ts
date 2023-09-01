import * as O from "fp-ts/Option";

import { constant, pipe } from "fp-ts/function";

import { AppData } from "./app-data";
import type { IO } from "fp-ts/IO";
import { pick } from "fp-ts-std/Struct";
import { sequenceS } from "fp-ts/Apply";

type WindowTitleData = Pick<AppData, "name" | "job">;

const ensureNoExcessProperties = (a: WindowTitleData) => pipe(
    a,
    pick(["name", "job"]),
);

const getTitleData = sequenceS(O.Apply);

export const getWindowTitleFromAppData = (data: WindowTitleData) => pipe(
    ensureNoExcessProperties(data),
    getTitleData,

    O.map(({ name, job }) => `A card about ${name} (${job})`),
    O.alt(() => pipe(data.name, O.map(name => `A card about ${name}`))),
    O.alt(() => pipe(data.job, O.map(job => `A card for ${job}`))),
    O.getOrElse(constant("A card about myself")),
);

export const setWindowTitle = (title: string): IO<void> => () => {
    document.title = title;
    document.querySelector("meta[name=description]")?.setAttribute("content", title);
};
