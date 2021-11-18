import { h as has, s as some, n as none } from '../../common/internal-eaae0092.js';

function lookup(k, r) {
    if (r === undefined) {
        return function (r) { return lookup(k, r); };
    }
    return has.call(r, k) ? some(r[k]) : none;
}
function mapWithIndex(f) {
    return function (r) {
        var out = {};
        for (var k in r) {
            if (has.call(r, k)) {
                out[k] = f(k, r[k]);
            }
        }
        return out;
    };
}

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// TODO: remove non-curried overloading in v3
/**
 * Lookup the value for a key in a `Record`.
 *
 * @since 2.0.0
 */
var lookup$1 = lookup;
/**
 * Map a `Record` passing the keys to the iterating function.
 *
 * @since 2.0.0
 */
var mapWithIndex$1 = mapWithIndex;

export { lookup$1 as lookup, mapWithIndex$1 as mapWithIndex };
