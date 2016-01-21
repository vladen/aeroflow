'use strict';

import { Aeroflow } from './aeroflow';
import { EMITTER } from './symbols';
import { constant, isFunction } from './utilites';

const toArrayEmitter = emitter => (next, done, context) => {
  let result = [];
  emitter(
    value => result.push(value),
    error => {
      next(result);
      done(error);
    },
    context);
};

const toArrayTransformingEmitter = (emitter, transformer) => (next, done, context) => {
  let index = 0, result = [];
  emitter(
    value => result.push(transformer(value, index++, context.data)),
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
  * Collects all values emitted by this flow to array, returns flow emitting this array.
  *
  * @param {function|any} [transformer] The mapping function used to transform each emitted value,
  *   or scalar value to fill array with ignoring source values.
  * @returns {Aeroflow} New flow that emits array.
  *
  * @example
  * aeroflow.range(1, 3).toArray().dump().run();
  * // next [1, 2, 3]
  * // done
  */
function toArray(transformer) {
  return new Aeroflow(arguments.length
    ? isFunction(transformer)
      ? toArrayTransformingEmitter(
          this[EMITTER],
          transformer)
      : toArrayTransformingEmitter(
          this[EMITTER],
          constant(transformer))
    : toArrayEmitter(this[EMITTER]));
}

export { toArray, toArrayEmitter, toArrayTransformingEmitter };