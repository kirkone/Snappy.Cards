import * as A from "fp-ts/Array";
import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as RAND from "fp-ts/Random";

import { fakerD, permute } from "../utils/utils-vitebook";
import { flow, pipe } from "fp-ts/function";

import { AppDataAdt } from "../model/app-data";
import { Card } from "./card";
import { RemoteImageAdt } from "../model/remote-image";

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
        facebook: [O.some(faker.hacker.noun()), O.none],
        youtube: [O.some(faker.hacker.noun()), O.none],
        instagram: [O.some(faker.hacker.noun()), O.none],
        twitch: [O.some(faker.hacker.noun()), O.none],
        github: [O.some(faker.hacker.noun()), O.none],
    }),
    permute
);

const CardStory = pipe(
    RAND.randomInt(0, 200),
    IO.map(flow(
        getCardData,
        A.map(data => <div style={{ margin: 30 }}>
            <Card
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
        </div>),
        (children) => <>{children}</>
    )),
);

export default CardStory;
