import { debug, program } from "@fun-ts/elmish";
import { init, sub, update, view } from "./components/app";

import { pipe } from "fp-ts/function";
import { withPreactSynchronous } from "@fun-ts/elmish-preact";

const appElement = document.getElementById("app");

if (!appElement) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error("App element not found.");
}

pipe(
    program.makeProgram({
        init,
        update,
        view,
    }),
    program.withSubscription(sub),
    debug.withConsoleDebug,
    withPreactSynchronous(appElement),
    program.run,
);
