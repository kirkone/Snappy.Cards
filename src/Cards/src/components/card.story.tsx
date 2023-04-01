import * as A from "fp-ts/Array";
import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as RAND from "fp-ts/Random";

import { fakerD, permute } from "../utils/utils-vitebook";
import { flow, pipe } from "fp-ts/function";

import { AppDataAdt } from "../model/app-data";
import { Card } from "./card";
import { RemoteImageAdt } from "../model/remote-image";
import { Variant } from "@vitebook/preact";
import { memoize } from "fp-ts-std/IO";
import { useState } from "preact/hooks";

const getCardData = flow(
    fakerD,
    faker => ({
        name: [O.some(`${faker.name.firstName()} ${faker.name.lastName()}`), O.none],
        sub: [O.some(faker.company.bsBuzz()), O.none],
        avatar: [O.some(faker.internet.avatar()), O.none],

        phone: [O.some(faker.phone.number()), O.none],
        mail: [O.some(faker.internet.email()), O.none],
        web: [O.some(faker.internet.url()), O.none],
        twitter: [O.some(faker.hacker.noun()), O.none],
        facebook: [O.some(faker.hacker.noun())],
        youtube: [O.some(faker.hacker.noun())],
        instagram: [O.some(faker.hacker.noun())],
        twitch: [O.some(faker.hacker.noun())],
        github: [O.some(faker.hacker.noun())],
    }),
    permute
);

const randomSeed = memoize(RAND.randomInt(0, 200));

const CardStory = () => <>
    <Variant
        name="Single Card">
        <SingleCard />
    </Variant>

    <Variant
        name="Lots of permutation">
        <Permutations />
    </Variant>
</>;

const SingleCard = pipe(
    randomSeed,
    IO.map(flow(
        fakerD,
        (faker) => {
            const [expanded, setExpanded] = useState<boolean>(false);
            const avatar = faker.internet.avatar();

            return <div style={{ margin: 30 }}>
                <Card
                    expanded={expanded}
                    onExpandClick={() => { setExpanded(!expanded); }}
                    data={AppDataAdt.as.Loaded({
                        name: O.some(`${faker.name.firstName()} ${faker.name.lastName()}`),
                        sub: O.some(faker.company.bsBuzz()),
                        avatar: O.some(avatar),

                        phone: O.some(faker.phone.number()),
                        mail: O.some(faker.internet.email()),
                        web: O.some(faker.internet.url()),
                        twitter: O.some(faker.hacker.noun()),
                        facebook: O.some(faker.hacker.noun()),
                        youtube: O.some(faker.hacker.noun()),
                        instagram: O.some(faker.hacker.noun()),
                        twitch: O.some(faker.hacker.noun()),
                        github: O.some(faker.hacker.noun()),
                        background: O.none,
                    })}
                    avatar={RemoteImageAdt.of.Loaded({
                        remoteUrl: avatar,
                        objectUrl: avatar
                    })}
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
                    data={AppDataAdt.as.Loaded({
                        ...data,
                        background: O.none,
                    })}

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
                />
            </div>;
        }),
        (children) => <>{children}</>
    ))
);

export default CardStory;
