'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { isFunction, isNothing, isRegExp } from './utilites';

const filterEmitter = (emitter, predicate) => (next, done, context) => {
  let index = 0;
  emitter(
    value => predicate(value, index++, context.data)
      ? next(value)
      : true,
    done,
    context);
};

/**
  * Returns new from emitting inly values that pass the test implemented by the provided predicate.
  *
  * @param {function|regexp|any} [predicate] The test applied to each emitted value.
  *
  * @example
  * aeroflow(0, 1).filter().dump().run();
  * // next 1
  * // done
  * aeroflow('a', 'b', 'a').filter(/a/).dump().run();
  * // next "a"
  * // next "a"
  * // done
  * aeroflow('a', 'b', 'b').filter('b').dump().run();
  * // next "b"
  * // next "b"
  * // done
  */
function filter(predicate) {
  return flow(filterEmitter(
    this[EMITTER],
    isNothing(predicate)
      ? value => !!value
      : isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate));
}

export { filter, filterEmitter };
