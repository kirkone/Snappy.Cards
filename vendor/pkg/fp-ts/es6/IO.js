import { c as constant } from '../../common/function-e09470ba.js';

/**
 * ```ts
 * interface IO<A> {
 *   (): A
 * }
 * ```
 *
 * `IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
 * type `A` and **never fails**. If you want to represent a synchronous computation that may fail, please see
 * `IOEither`.
 *
 * @since 2.0.0
 */
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (ma, f) { return function () { return f(ma()); }; };
var _ap = function (mab, ma) { return function () { return mab()(ma()); }; };
var _chain = function (ma, f) { return function () { return f(ma())(); }; };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return _map(fa, f); }; };
/**
 * @category Pointed
 * @since 2.0.0
 */
var of = constant;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) { return _chain(ma, f); }; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI = 'IO';
/**
 * @category instances
 * @since 2.10.0
 */
var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};

export { Apply, chain, map, of };
