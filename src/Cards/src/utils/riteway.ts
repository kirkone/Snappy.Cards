import { expect, test } from 'vitest';

interface Assertion<T> {
    readonly given: string;
    readonly should: string;
    readonly actual: T;
    readonly expected: T;
}

export function assert<T>(assertion: Assertion<T>) {
    test(`${assertion.given}: should ${assertion.should}`, () => {
        expect(assertion.actual).toEqual(assertion.expected);
    });
}

assert.todo = function todo<T>(assertion: Assertion<T>) {
    test.todo(`${assertion.given}: should ${assertion.should}`, () => {
        expect(assertion.actual).toEqual(assertion.expected);
    });
};

assert.only = function only<T>(assertion: Assertion<T>) {
    test.only(`${assertion.given}: should ${assertion.should}`, () => {
        expect(assertion.actual).toEqual(assertion.expected);
    });
};

assert.skip = function skip<T>(assertion: Assertion<T>) {
    test.skip(`${assertion.given}: should ${assertion.should}`, () => {
        expect(assertion.actual).toEqual(assertion.expected);
    });
};
