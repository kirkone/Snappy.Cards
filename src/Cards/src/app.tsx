// #region Imports

import { ElmishResult, Init, Update, cmd } from "@fun-ts/elmish";

import type { PreactView } from "@fun-ts/elmish-preact";
import { absurd } from "fp-ts/function";

// #endregion

// ============================================================================
// #region Model
// ============================================================================
export type Model = {};

export const init: Init<Model, Msg> = (): ElmishResult<Model, Msg> => [
    {},
    cmd.none
];

// #endregion

// ============================================================================
// #region Messages
// ============================================================================
export type Msg =
    | { type: "M1"; }
    | { type: "M2"; }
    ;

// #endregion

// ============================================================================
// #region Update
// ============================================================================
export const update: Update<Model, Msg> = (model, msg): ElmishResult<Model, Msg> => {
    switch (msg.type) {
        case "M1":
            return [model, cmd.none];

        case "M2":
            return [model, cmd.none];

        default:
            return absurd(msg);
    }
};

// #endregion

// ============================================================================
// #region View
// ============================================================================
export const view: PreactView<Model, Msg> = (dispatch, _model) => (
    <>
        <button onClick={() => dispatch({ type: "M1" })}>-</button>
    </>
);

// #endregion
