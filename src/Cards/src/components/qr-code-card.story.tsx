import * as IO from "fp-ts/IO";
import * as RAND from "fp-ts/Random";

import { flow, pipe } from "fp-ts/function";

import { QrCodeCard } from "./qr-code-card";
import { fakerD } from "./utils";

const getQrCodeCardData = flow(
    fakerD,
    faker => faker.internet.url(),
);

const QrCodeCardStory = pipe(
    RAND.randomInt(0, 200),
    IO.map(flow(
        getQrCodeCardData,
        href => <QrCodeCard href={href} />
    ))
);

export default QrCodeCardStory;
