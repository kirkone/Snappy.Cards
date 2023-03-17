import * as O from "fp-ts/Option";

import { flow, tuple } from "fp-ts/function";

import { Card } from "./card";
import { Flip } from "./flip";
import { RemoteImageAdt } from "../model/remote-image";
import { fakerD } from "../utils/utils-vitebook";

const getCardData = flow(
    fakerD,
    faker => {
        const baseData = {
            name: O.some(`${faker.name.firstName()} ${faker.name.lastName()}`),
            sub: O.some(faker.company.bsBuzz()),
            avatar: faker.internet.avatar(),
            phone: O.some(faker.phone.number()),
            mail: O.some(faker.internet.email()),
            web: O.some(faker.internet.url()),
        };

        return tuple(
            {
                ...baseData,
                twitter: O.none,
                facebook: O.none,
                youtube: O.none,
                instagram: O.none,
                twitch: O.none,
                github: O.none,
            },
            {
                ...baseData,
                twitter: O.some(faker.hacker.noun()),
                facebook: O.some(faker.hacker.noun()),
                youtube: O.some(faker.hacker.noun()),
                instagram: O.some(faker.hacker.noun()),
                twitch: O.some(faker.hacker.noun()),
                github: O.some(faker.hacker.noun()),
            }
        );
    },
);

const QrCodeCardStory = () => {
    const [cardDataFront, cardDataBack] = getCardData(42);

    return <Flip
        front={<Card
            data={cardDataFront}
            avatar={RemoteImageAdt.as.Loaded({ url: cardDataFront.avatar })} />
        }
        back={<Card
            data={cardDataBack}
            avatar={RemoteImageAdt.as.Loaded({ url: cardDataBack.avatar })} />
        }
    />;
};

export default QrCodeCardStory;
