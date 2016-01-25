'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { constant, identity, isFunction } from './utilites';

export function toMapOperator(keyTransformation, valueTransformation) {
  const keyTransformer = isNothing(keyTransformation)
    ? identity
    : isFunction(keyTransformation)
      ? keyTransformation
      : constant(keyTransformation);
  const valueTransformer = isNothing(valueTransformation)
    ? identity
    : isFunction(valueTransformation)
      ? valueTransformation
      : constant(valueTransformation);
  return emitter=> (next, done, context) => {
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
}
