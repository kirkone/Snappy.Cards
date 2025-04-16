import { flow, pipe } from "fp-ts/function";
import * as IO from "fp-ts/IO";
import * as RAND from "fp-ts/Random";

import { Meta, StoryObj } from "../utils/storybook";
import { fakerD } from "../utils/faker";
import { QrCodeCard } from "./qr-code-card";

const meta = {
    title: "Components/QrCodeCard",
    component: QrCodeCard,
    args: {
    },
} satisfies Meta<typeof QrCodeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const getQrCodeCardData = flow(
    fakerD,
    faker => faker.internet.url(),
);

export const Default: Story = {
    args: {
        href: pipe(
            RAND.randomInt(0, 200),
            IO.map(getQrCodeCardData),
        )()
    },
};
