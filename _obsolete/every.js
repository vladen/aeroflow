'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { isFunction, isNothing, isRegExp } from './utilites';

const everyEmitter = (emitter, predicate) => (next, done, context) => {
  let idle = true, result = true;
  context = context.spawn();
  emitter(
    value => {
      idle = false;
      if (!predicate(value))
        return;
      result = false;
      context.done();
    },
    error => {
      next(result && !idle);
      done(error);
    },
    context);
};

/**
  * Tests whether all values emitted by this flow pass the predicate test, returns flow emitting true if the predicate returns true for all emitted values; otherwise, false.
  *
  * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
  *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
  * @returns {Aeroflow} New flow that emits true or false.
  *
  * @example
  * aeroflow(1).every().dump().run();
  * // next true
  * // done
  * aeroflow.range(1, 3).every(2).dump().run();
  * // next false
  * // done
  * aeroflow.range(1, 3).every(value => value % 2).dump().run();
  * // next false
  * // done
  */
function every(predicate) {
  return flow(everyEmitter(
    this[EMITTER],
    isNothing(predicate)
      ? value => !!value
      : isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate));
}

export { every, everyEmitter };
