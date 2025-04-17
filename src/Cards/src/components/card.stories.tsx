import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as RAND from "fp-ts/Random";

import { flow, pipe } from "fp-ts/function";
import { fakerD } from "../utils/faker";

import { action } from "@storybook/addon-actions";
import { memoize } from "fp-ts-std/IO";
import { RemoteImageAdt } from "../model/remote-image";
import { Meta, StoryObj } from "../utils/storybook";
import { Card } from "./card";

const getCardData = flow(
    fakerD,
    faker => ({
        name: O.some(`${faker.person.firstName()} ${faker.person.lastName()}`),
        job: O.some(faker.person.jobTitle()),
        sub: O.some(faker.company.buzzVerb()),

        avatar: faker.image.avatar(),

        phone: O.some(faker.phone.number()),
        mail: O.some(faker.internet.email()),
        web: O.some(faker.internet.url()),
        twitter: O.some(faker.hacker.noun()),
        facebook: O.some(faker.hacker.noun()),
        youtube: O.some(faker.hacker.noun()),
        instagram: O.some(faker.hacker.noun()),
        twitch: O.some(faker.hacker.noun()),
        github: O.some(faker.hacker.noun()),
        linkedIn: O.some(faker.hacker.noun()),
        xing: O.some(faker.hacker.noun()),
        paypal: O.some(faker.hacker.noun()),
        patreon: O.some(faker.hacker.noun()),
        pinterest: O.some(faker.hacker.noun()),
        npm: O.some(faker.hacker.noun()),
        soundcloud: O.some(faker.hacker.noun()),
        snapchat: O.some(faker.hacker.noun()),
        steam: O.some(faker.hacker.noun()),
        cpan: O.some(faker.hacker.noun()),
        signal: O.some(faker.hacker.noun()),
        telegram: O.some(faker.hacker.noun()),
    }),
);

const emptyCardData = {
    name: O.none,
    job: O.none,
    sub: O.none,

    phone: O.none,
    mail: O.none,
    web: O.none,
    twitter: O.none,
    facebook: O.none,
    youtube: O.none,
    instagram: O.none,
    twitch: O.none,
    github: O.none,
    linkedIn: O.none,
    xing: O.none,
    paypal: O.none,
    patreon: O.none,
    pinterest: O.none,
    npm: O.none,
    soundcloud: O.none,
    snapchat: O.none,
    steam: O.none,
    cpan: O.none,
    signal: O.none,
    telegram: O.none,
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
            getCardData,
            (data) => ({
                data,
                avatar: RemoteImageAdt.of.Loaded({
                    remoteUrl: data.avatar,
                    objectUrl: data.avatar
                }),
                maximumDetailsVisible: O.none,
            }),
        )),
    )()
};

export const NoAvatar: Story = {
    args: pipe(
        randomSeed,
        IO.map(flow(
            getCardData,
            (data) => ({
                data: {
                    ...emptyCardData,

                    name: data.name,
                    job: data.job,
                    sub: data.sub,

                    twitter: data.twitter,
                    facebook: data.facebook,
                    youtube: data.youtube,
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
            getCardData,
            (data) => ({
                ...NoAvatar.args,
                avatar: RemoteImageAdt.of.Loaded({
                    remoteUrl: data.avatar,
                    objectUrl: data.avatar
                }),
            }),
        )),
    )()
};

export const WithThreeMediaExpandNotVisible: Story = {
    args: pipe(
        randomSeed,
        IO.map(flow(
            getCardData,
            (data) => ({
                data: {
                    ...emptyCardData,

                    name: data.name,
                    job: data.job,
                    sub: data.sub,

                    twitter: data.twitter,
                    facebook: data.facebook,
                    youtube: data.youtube,
                },
                avatar: RemoteImageAdt.of.Loaded({
                    remoteUrl: data.avatar,
                    objectUrl: data.avatar
                }),
                maximumDetailsVisible: O.some(3),
            }),
        )),
    )()
};

export const WithThreeMediaExpandVisible: Story = {
    args: {
        ...WithThreeMediaExpandNotVisible.args,
        maximumDetailsVisible: O.some(2),
    },
};
