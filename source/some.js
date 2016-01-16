'use strict';

import { Aeroflow } from './aeroflow';
import { SYMBOL_EMITTER } from './symbols';
import { isFunction, isRegExp } from './utilites';

const someEmitter = (emitter, predicate) => (next, done, context) => {
  let result = false;
  context = context.spawn();
  emitter(
    value => {
      if (!predicate(value))
        return;
      result = true;
      context.end();
    },
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
* Tests whether some value emitted by this flow passes the predicate test,
  *   returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.
  *
  * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
  *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
  * @returns {Aeroflow} New flow that emits true or false.
  *
  * @example
  * aeroflow(0).some().dump().run();
  * // next false
  * // done
  * aeroflow.range(1, 3).some(2).dump().run();
  * // next true
  * // done
  * aeroflow.range(1, 3).some(value => value % 2).dump().run();
  * // next true
  * // done
  */
function some(predicate) {
  return new Aeroflow(someEmitter(
    this[SYMBOL_EMITTER],
    arguments.length
      ? isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate
      : value => !!value));
}

export { some, someEmitter };
