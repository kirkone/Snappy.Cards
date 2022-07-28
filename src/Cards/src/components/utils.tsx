import * as A from "fp-ts/Array";

import { faker } from '@faker-js/faker';
import { sequenceS } from "fp-ts/Apply";

export const permute = sequenceS(A.Apply);
export const fakerD = (seed: number) => {
    faker.seed(seed);
    return faker;
};
