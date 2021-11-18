import { p as pipe } from '../../common/function-e09470ba.js';
import { n as none$1, s as some$1 } from '../../common/internal-eaae0092.js';

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 2.0.0
 */
var none = none$1;
/**
 * Constructs a `Some`. Represents an optional value that exists.
 *
 * @category constructors
 * @since 2.0.0
 */
var some = some$1;
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? some(a) : none); };
}
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return pipe(fa, map(f)); };
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI = 'Option';
/**
 * @category instance operations
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return isNone(fa) ? none : some(f(fa.value));
}; };
/**
 * @category instance operations
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) {
    return isNone(fab) ? none : isNone(fa) ? none : some(fab.value(fa.value));
}; };
/**
 * @category instances
 * @since 2.10.0
 */
var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category instance operations
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) {
    return isNone(ma) ? none : f(ma.value);
}; };
/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category refinements
 * @since 2.0.0
 */
var isNone = function (fa) { return fa._tag === 'None'; };
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
var fromNullable = function (a) { return (a == null ? none : some(a)); };

export { Apply, chain, fromNullable, fromPredicate, map };
