import type {
    Args,
    ArgsFromMeta,
    ArgsStoryFn,
    ComponentAnnotations,
    StoryAnnotations
} from "@storybook/types";
import { ComponentProps, ComponentType } from "preact";
import { SetOptional, Simplify } from "type-fest";

import { PreactRenderer } from "@storybook/preact";

export type { ArgTypes, Args, Parameters, StrictArgs } from "@storybook/types";

type ActionArgs<TArgs> = {
    // This can be read as: filter TArgs on functions where we can assign a void function to that function.
    // The docs addon argsEnhancers can only safely provide a default value for void functions.
    // Other kind of required functions should be provided by the user.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [P in keyof TArgs as TArgs[P] extends (...args: any[]) => any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? ((...args: any[]) => void) extends TArgs[P]
    ? P
    : never
    : never]: TArgs[P];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Meta<TCmpOrArgs = Args> = TCmpOrArgs extends ComponentType<any>
    ? ComponentAnnotations<PreactRenderer, ComponentProps<TCmpOrArgs>>
    : ComponentAnnotations<PreactRenderer, TCmpOrArgs>;

export type StoryObj<TMetaOrCmpOrArgs = Args> = TMetaOrCmpOrArgs extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: ArgsStoryFn<PreactRenderer, any>;
    component?: infer Component;
    args?: infer DefaultArgs;
}
    ? Simplify<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Component extends ComponentType<any> ? ComponentProps<Component> : unknown) &
        ArgsFromMeta<PreactRenderer, TMetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        PreactRenderer,
        TArgs,
        SetOptional<TArgs, keyof TArgs & keyof (DefaultArgs & ActionArgs<TArgs>)>
    >
    : never
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : TMetaOrCmpOrArgs extends ComponentType<any>
    ? StoryAnnotations<PreactRenderer, ComponentProps<TMetaOrCmpOrArgs>>
    : StoryAnnotations<PreactRenderer, TMetaOrCmpOrArgs>;
