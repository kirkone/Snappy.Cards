import { faker } from '@faker-js/faker';

export const fakerD = (seed: number) => {
    faker.seed(seed);
    return faker;
};
