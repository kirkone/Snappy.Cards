import { Meta, StoryObj } from "../utils/storybook";
import * as O from "fp-ts/Option";
import { BrowserDataAdt, getBrowserData } from "../model/browser-data";
import { SharePage } from "./share-page";
import { VCardDataAdt } from "../model/v-card-url";

const meta = {
    title: "Components/SharePage",
    component: SharePage,
    args: {
        name: O.some("Guybrush Threepwood"),
        browserData: BrowserDataAdt.of.Loaded(getBrowserData()),
        onShareClick: () => { },
    },
} satisfies Meta<typeof SharePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
    args: {
        downloadUrl: VCardDataAdt.as.Loaded({ url: "" }),
    },
};

export const NotLoaded: Story = {
    args: {
        downloadUrl: VCardDataAdt.as.NotLoaded({ url: "" }),
    },
};

export const Failure: Story = {
    args: {
        downloadUrl: VCardDataAdt.as.Failure({ url: "" }),
    },
};

export const Loading: Story = {
    args: {
        downloadUrl: VCardDataAdt.as.Loading({ url: "" }),
    },
};
