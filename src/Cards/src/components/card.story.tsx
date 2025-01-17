import * as A from "fp-ts/Array";
import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as RAND from "fp-ts/Random";

import { fakerD, permute } from "../utils/utils-vitebook";
import { flow, pipe } from "fp-ts/function";

import { Card } from "./card";
import { RemoteImageAdt } from "../model/remote-image";
import { Variant } from "@vitebook/preact";
import { memoize } from "fp-ts-std/IO";
import { useState } from "preact/hooks";

const getCardData = flow(
    fakerD,
    faker => ({
        name: [O.some(`${faker.person.firstName()} ${faker.person.lastName()}`), O.none],
        job: [O.some(faker.person.jobTitle()), O.none],
        sub: [O.some(faker.company.buzzVerb()), O.none],
        avatar: [O.some(faker.image.avatar()), O.none],

        phone: [O.some(faker.phone.number()), O.none],
        mail: [O.some(faker.internet.email()), O.none],
        web: [O.some(faker.internet.url()), O.none],
        twitter: [O.some(faker.hacker.noun()), O.none],
        facebook: [O.some(faker.hacker.noun())],
        youtube: [O.some(faker.hacker.noun())],
        instagram: [O.some(faker.hacker.noun())],
        twitch: [O.some(faker.hacker.noun())],
        github: [O.some(faker.hacker.noun())],
        linkedIn: [O.some(faker.hacker.noun())],
        xing: [O.some(faker.hacker.noun())],
        paypal: [O.some(faker.hacker.noun())],
        patreon: [O.some(faker.hacker.noun())],
        pinterest: [O.some(faker.hacker.noun())],
        npm: [O.some(faker.hacker.noun())],
        soundcloud: [O.some(faker.hacker.noun())],
        snapchat: [O.some(faker.hacker.noun())],
        steam: [O.some(faker.hacker.noun())],
        cpan: [O.some(faker.hacker.noun())],
    }),
    permute
);

const randomSeed = memoize(RAND.randomInt(0, 200));

const CardStory = () => <>
    <Variant
        name="Single Card All Media">
        <SingleCardAll />
    </Variant>

    <Variant
        name="Single Card Three Media">
        <SingleCardOnlyThree />
    </Variant>

    <Variant
        name="Single Card With Job and Three Media">
        <SingleCardWithJobOnlyThree />
    </Variant>

    <Variant
        name="Single Card With Job and Two Media">
        <SingleCardWithJobOnlyTwo />
    </Variant>

    <Variant
        name="Lots of permutation">
        <Permutations />
    </Variant>
</>;

const SingleCardAll = pipe(
    randomSeed,
    IO.map(flow(
        fakerD,
        (faker) => {
            const [expanded, setExpanded] = useState<boolean>(false);
            const avatar = faker.image.avatar();

            return <div style={{ margin: 30 }}>
                <Card
                    expanded={expanded}
                    onExpandClick={() => { setExpanded(!expanded); }}
                    data={{
                        name: O.some(`${faker.person.firstName()} ${faker.person.lastName()}`),
                        job: O.some(faker.person.jobTitle()),
                        sub: O.some(faker.company.buzzVerb()),

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
                    }}
                    avatar={RemoteImageAdt.of.Loaded({
                        remoteUrl: avatar,
                        objectUrl: avatar
                    })}
                    maximumDetailsVisible={O.some(5)}
                />
            </div>;
        }
    ))
);

export const SingleCardOnlyThree = pipe(
    randomSeed,
    IO.map(flow(
        fakerD,
        (faker) => {
            const [expanded, setExpanded] = useState<boolean>(false);
            const avatar = faker.image.avatar();

            return <div style={{ margin: 30 }}>
                <Card
                    expanded={expanded}
                    onExpandClick={() => { setExpanded(!expanded); }}
                    data={{
                        name: O.some(`${faker.person.firstName()} ${faker.person.lastName()}`),
                        job: O.none,
                        sub: O.none,

                        phone: O.none,
                        mail: O.none,
                        web: O.none,
                        twitter: O.some(faker.hacker.noun()),
                        facebook: O.some(faker.hacker.noun()),
                        youtube: O.some(faker.hacker.noun()),
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
                    }}
                    avatar={RemoteImageAdt.of.Loaded({
                        remoteUrl: avatar,
                        objectUrl: avatar
                    })}
                    maximumDetailsVisible={O.none}
                />
            </div>;
        }
    ))
);

export const SingleCardWithJobOnlyTwo = pipe(
    randomSeed,
    IO.map(flow(
        fakerD,
        (faker) => {
            const [expanded, setExpanded] = useState<boolean>(false);
            const avatar = faker.image.avatar();

            return <div style={{ margin: 30 }}>
                <Card
                    expanded={expanded}
                    onExpandClick={() => { setExpanded(!expanded); }}
                    data={{
                        name: O.some(`${faker.person.firstName()} ${faker.person.lastName()}`),
                        job: O.some(faker.person.jobTitle()),
                        sub: O.some(faker.company.buzzVerb()),

                        phone: O.none,
                        mail: O.none,
                        web: O.none,
                        twitter: O.some(faker.hacker.noun()),
                        facebook: O.some(faker.hacker.noun()),
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
                    }}
                    avatar={RemoteImageAdt.of.Loaded({
                        remoteUrl: avatar,
                        objectUrl: avatar
                    })}
                    maximumDetailsVisible={O.none}
                />
            </div>;
        }
    ))
);

export const SingleCardWithJobOnlyThree = pipe(
    randomSeed,
    IO.map(flow(
        fakerD,
        (faker) => {
            const [expanded, setExpanded] = useState<boolean>(false);
            const avatar = faker.image.avatar();

            return <div style={{ margin: 30 }}>
                <Card
                    expanded={expanded}
                    onExpandClick={() => { setExpanded(!expanded); }}
                    data={{
                        name: O.some(`${faker.person.firstName()} ${faker.person.lastName()}`),
                        job: O.some(faker.person.jobTitle()),
                        sub: O.some(faker.company.buzzVerb()),

                        phone: O.none,
                        mail: O.none,
                        web: O.none,
                        twitter: O.some(faker.hacker.noun()),
                        facebook: O.some(faker.hacker.noun()),
                        youtube: O.some(faker.hacker.noun()),
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
                    }}
                    avatar={RemoteImageAdt.of.Loaded({
                        remoteUrl: avatar,
                        objectUrl: avatar
                    })}
                    maximumDetailsVisible={O.none}
                />
            </div>;
        }
    ))
);

const Permutations = pipe(
    randomSeed,
    IO.map(flow(
        getCardData,
        A.map(data => {
            const [expanded, setExpanded] = useState<boolean>(false);

            return <div style={{ margin: 30 }}>
                <Card
                    expanded={expanded}
                    onExpandClick={() => { setExpanded(!expanded); }}
                    data={data}

                    avatar={pipe(
                        data.avatar,
                        O.fold(
                            () => RemoteImageAdt.of.NotLoaded({}),
                            remoteUrl => RemoteImageAdt.of.Loaded({
                                remoteUrl,
                                objectUrl: remoteUrl
                            }),
                        ),
                    )}
                    maximumDetailsVisible={O.none}
                />
            </div>;
        }),
        (children) => <>{children}</>
    ))
);

export default CardStory;
