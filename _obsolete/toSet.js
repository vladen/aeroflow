'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { constant, isFunction } from './utilites';

const toSetEmitter = emitter => (next, done, context) => {
  let result = new Set;
  emitter(
    value =>
      result.add(value),
    error => {
      next(result);
      done(error);
    },
    context);
};

const toSetTransformingEmitter = (emitter, transformer) => (next, done, context) => {
  let index = 0, result = new Set;
  emitter(
    value =>
      result.add(transformer(value, index++, context.data)),
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
  * Collects all values emitted by this flow to ES6 set, returns flow emitting this set.
  *
  * @param {function|any} [transformer] The mapping function used to transform each emitted value to key,
  *   or scalar value to use as key.
  * @returns {Aeroflow} New flow that emits set.
  *
  * @example
  * aeroflow.range(1, 3).toSet().dump().run();
  * // next Set {1, 2, 3}
  * // done
  * aeroflow.range(1, 3).toSet(v => 'key' + v).dump().run();
  * // next Set {"key1", "key2", "key3"}
  * // done
  */
function toSet(transformer) {
  return flow(arguments.length === 0
    ? toSetEmitter(this[EMITTER])
    : toSetTransformingEmitter(
        this[EMITTER],
        isFunction(transformer)
        ? transformer
        : constant(transformer)));
}

export { toSet, toSetEmitter, toSetTransformingEmitter };
