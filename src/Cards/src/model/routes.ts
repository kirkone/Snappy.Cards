import { ValueOf } from "type-fest";
import { absurd } from "fp-ts/function";
import { cmd } from "@fun-ts/elmish";

export type Route = ValueOf<typeof Routes>;

const Routes = {
    Card: "Card",
    Qr: "Qr",
    Share: "Share",
} as const;

export const as = Routes;

export const of: Record<Route, Route> = Routes;

export const match = <R>(
    { Card, Qr, Share }: { [T in Route]: (v: T) => R }
) => (
    value: Route
) => {
        switch (value) {
            case "Card": return Card(value);
            case "Qr": return Qr(value);
            case "Share": return Share(value);
            default: return absurd<Route>(value);
        }
    };

export const goToRouteCmd = (route: Route) => cmd.ofSub<never>(() => {
    document.querySelector(`#${route}`)?.scrollIntoView({
        behavior: "smooth"
    });
});
