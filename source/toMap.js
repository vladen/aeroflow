'use strict';

import { Aeroflow } from './aeroflow';
import { SYMBOL_EMITTER } from './symbols';
import { constant, identity, isFunction } from './utilites';

const toMapEmitter = emitter => (next, done, context) => {
  let result = new Map;
  emitter(
    value => result.set(value, value),
    error => {
      next(result);
      done(error);
    },
    context);
};

const toMapTransformingEmitter = (emitter, keyTransformer, valueTransformer) => (next, done, context) => {
  let index = 0, result = new Map;
  emitter(
    value => result.set(
      keyTransformer(value, index++, context.data),
      valueTransformer(value, index++, context.data)),
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
  * Collects all values emitted by this flow to ES6 map, returns flow emitting this map.
  *
  * @param {function|any} [keyTransformer] The mapping function used to transform each emitted value to map key,
  *   or scalar value to use as map key.
  * @param {function|any} [valueTransformer] The mapping function used to transform each emitted value to map value,
  *   or scalar value to use as map value.
  * @returns {Aeroflow} New flow that emits map.
  *
  * @example
  * aeroflow.range(1, 3).toMap(v => 'key' + v, true).dump().run();
  * // next Map {"key1" => true, "key2" => true, "key3" => true}
  * // done
  * aeroflow.range(1, 3).toMap(v => 'key' + v, v => v * 10).dump().run();
  * // next Map {"key1" => 10, "key2" => 20, "key3" => 30}
  * // done
  */
function toMap(keyTransformer, valueTransformer) {
  return new Aeroflow(arguments.length === 0
    ? toMapEmitter(this[SYMBOL_EMITTER])
    : toMapTransformingEmitter(
        this[SYMBOL_EMITTER],
        isFunction(keyTransformer)
          ? keyTransformer
          : constant(keyTransformer),
        arguments.length === 1
          ? identity
          : isFunction(valueTransformer)
            ? keyTransformer
            : constant(valueTransformer)));
}

export { toMap, toMapEmitter, toMapTransformingEmitter };
