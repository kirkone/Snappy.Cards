import * as A from "fp-ts/Array";
import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as S from "fp-ts/string";
import * as RAND from "fp-ts/Random";
import * as ORD from "fp-ts/Ord";

import { flow, pipe } from "fp-ts/function";
import { fakerD } from "../utils/faker";

import { action } from "@storybook/addon-actions";
import { memoize } from "fp-ts-std/IO";
import { RemoteImageAdt } from "../model/remote-image";
import { Meta, StoryObj } from "../utils/storybook";
import { Card, CardData, CardProps } from "./card";

type StoryData = Pick<CardProps, "data" | "avatar">;

const ByName: ORD.Ord<CardData["info"][number]> = pipe(
    S.Ord,
    ORD.contramap(([name]) => name),
);

const getStoryData = flow(
    fakerD,
    (faker): StoryData => {
        const avatar = faker.image.avatar();

        return ({
            data: {
                name: O.some(`${faker.person.firstName()} ${faker.person.lastName()}`),
                job: O.some(faker.person.jobTitle()),
                sub: O.some(faker.company.buzzVerb()),

                info: [
                    ["phone", faker.phone.number()],
                    ["mail", faker.internet.email()],
                    ["web", faker.internet.url()],
                    ["twitter", faker.hacker.noun()],
                    ["facebook", faker.hacker.noun()],
                    ["youtube", faker.hacker.noun()],
                    ["instagram", faker.hacker.noun()],
                    ["twitch", faker.hacker.noun()],
                    ["github", faker.hacker.noun()],
                    ["linkedIn", faker.hacker.noun()],
                    ["xing", faker.hacker.noun()],
                    ["paypal", faker.hacker.noun()],
                    ["patreon", faker.hacker.noun()],
                    ["pinterest", faker.hacker.noun()],
                    ["npm", faker.hacker.noun()],
                    ["soundcloud", faker.hacker.noun()],
                    ["snapchat", faker.hacker.noun()],
                    ["steam", faker.hacker.noun()],
                    ["cpan", faker.hacker.noun()],
                    ["signal", faker.hacker.noun()],
                    ["telegram", faker.hacker.noun()],
                ]
            },
            avatar: RemoteImageAdt.of.Loaded({
                remoteUrl: avatar,
                objectUrl: avatar
            }),
        });
    },
);

const emptyCardData: CardData = {
    name: O.none,
    job: O.none,
    sub: O.none,

    info: [],
};

const randomSeed = memoize(RAND.randomInt(0, 200));

const meta = {
    title: "Components/Card",
    component: Card,
    args: {
        expanded: true,
        data: emptyCardData,
        avatar: RemoteImageAdt.of.NotLoaded({}),
        maximumDetailsVisible: O.some(5),
        onExpandClick: action("onExpandClick"),
    },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Full: Story = {
    args: pipe(
        randomSeed,
        IO.map(flow(
            getStoryData,
            ({ data, avatar }) => ({
                data,
                avatar,
                maximumDetailsVisible: O.none,
            }),
        )),
    )()
};

export const NoAvatar: Story = {
    args: pipe(
        randomSeed,
        IO.map(flow(
            getStoryData,
            ({ data }) => ({
                data: {
                    ...emptyCardData,

                    name: data.name,
                    job: data.job,
                    sub: data.sub,

                    info: pipe(
                        data.info,
                        A.takeLeft(3),
                    )
                },
                maximumDetailsVisible: O.some(3),
            }),
        )),
    )()
};

export const WithJob: Story = {
    args: pipe(
        randomSeed,
        IO.map(flow(
            getStoryData,
            ({ avatar }) => ({
                ...NoAvatar.args,
                avatar,
            }),
        )),
    )()
};

export const WithThreeMediaExpandNotVisible: Story = {
    args: pipe(
        randomSeed,
        IO.map(flow(
            getStoryData,
            ({ data, avatar }) => ({
                data: {
                    ...emptyCardData,

                    name: data.name,
                    job: data.job,
                    sub: data.sub,

                    info: pipe(
                        data.info,
                        A.takeLeft(3),
                    )
                },
                avatar,
                maximumDetailsVisible: O.some(3),
            }),
        )),
    )()
};

export const WithThreeMediaExpandVisible: Story = {
    args: {
        ...WithThreeMediaExpandNotVisible.args,
        expanded: false,
        maximumDetailsVisible: O.some(2),
    },
};

export const WithDoubleEntries: Story = {
    args: pipe(
        randomSeed,
        IO.map(flow(
            getStoryData,
            ({ data, avatar }) => ({
                data: {
                    ...data,
                    info: pipe(
                        data.info,
                        A.takeLeft(5),
                        xs => [
                            ...xs,
                            ...xs
                        ],
                        A.sort(ByName)
                    )
                },

                avatar,
                maximumDetailsVisible: O.none,
            }),
        )),
    )()
};
