import { debug, program } from "@fun-ts/elmish";
import { init, sub, update, view } from "./components/app";

import { pipe } from "fp-ts/function";
import { withPreactSynchronous } from "@fun-ts/elmish-preact";

pipe(
    program.makeProgram({
        init,
        update,
        view,
    }),
    program.withSubscription(sub),
    debug.withConsoleDebug,
    withPreactSynchronous(document.getElementById("app")!),
    program.run,
);
