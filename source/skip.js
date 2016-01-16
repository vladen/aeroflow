'use strict';

import { Aeroflow } from './aeroflow';
import { SYMBOL_EMITTER } from './symbols';
import { toArrayEmitter } from './toArray';
import { isFunction, isNumber, noop } from './utilites';

const skipAllEmitter = emitter => (next, done, context) => emitter(noop, done, context);

const skipFirstEmitter = (emitter, count) => (next, done, context) => {
  let index = -1;
  emitter(
    value => ++index < count
      ? false
      : next(value),
    done,
    context);
};

const skipLastEmitter = (emitter, count) => (next, done, context) => toArrayEmitter(emitter)(
  value => {
    for (let index = -1, limit = value.length - count; ++index < limit;)
      next(value[index]);
  },
  done,
  context);

const skipWhileEmitter = (emitter, predicate) => (next, done, context) => {
  let index = 0, skipping = true;
  emitter(
    value => {
      if (skipping && !predicate(value, index++, context.data))
        skipping = false;
      if (!skipping)
        next(value);
    },
    done,
    context);
};

/**
  * Skips some of the values emitted by this flow,
  *   returns flow emitting remaining values.
  *
  * @param {number|function|any} [condition] The number or predicate function used to determine how many values to skip.
  *   If omitted, returned flow skips all values emitting done event only.
  *   If zero, returned flow skips nothing.
  *   If positive number, returned flow skips this number of first emitted values.
  *   If negative number, returned flow skips this number of last emitted values.
  *   If function, returned flow skips emitted values while this function returns trythy value.
  * @returns {Aeroflow} new flow emitting remaining values.
  *
  * @example
  * aeroflow([1, 2, 3]).skip().dump().run();
  * // done
  * aeroflow([1, 2, 3]).skip(1).dump().run();
  * // next 2
  * // next 3
  * // done
  * aeroflow([1, 2, 3]).skip(-1).dump().run();
  * // next 1
  * // next 2
  * // done
  * aeroflow([1, 2, 3]).some(value => value < 3).dump().run();
  * // next 3
  * // done
  */
function skip(condition) {
  return arguments.length
    ? isNumber(condition)
      ? condition === 0
        ? this
        : new Aeroflow(condition > 0
          ? skipFirstEmitter(
              this[SYMBOL_EMITTER],
              condition)
          : skipLastEmitter(
              this[SYMBOL_EMITTER],
              -condition))
      : isFunction(condition)
        ? new Aeroflow(skipWhileEmitter(
            this[SYMBOL_EMITTER],
            condition))
        : condition
          ? new Aeroflow(skipAllEmitter(this[SYMBOL_EMITTER]))
          : this
    : new Aeroflow(skipAllEmitter(this[SYMBOL_EMITTER]));
}

export { skip, skipAllEmitter, skipFirstEmitter, skipLastEmitter, skipWhileEmitter };
