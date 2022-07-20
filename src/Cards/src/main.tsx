import { debug, program } from "@fun-ts/elmish";
import { init, update, view } from "./app";

import { pipe } from "fp-ts/function";
import { withPreactSynchronous } from "@fun-ts/elmish-preact";

pipe(
    program.makeProgram({
        init,
        update,
        view,
    }),
    debug.withConsoleDebug,
    withPreactSynchronous(document.getElementById("app")!),
    program.run,
);
