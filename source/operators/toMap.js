'use strict';

import { constant, identity, isFunction, isUndefined } from '../utilites';

export function toMapOperator(keyTransformation, valueTransformation) {
  const keyTransformer = isUndefined(keyTransformation)
    ? identity
    : isFunction(keyTransformation)
      ? keyTransformation
      : constant(keyTransformation);
  const valueTransformer = isUndefined(valueTransformation)
    ? identity
    : isFunction(valueTransformation)
      ? valueTransformation
      : constant(valueTransformation);
  return emitter=> (next, done, context) => {
    let index = 0, result = new Map;
    emitter(
      value => {
        result.set(
          keyTransformer(value, index++, context.data),
          valueTransformer(value, index++, context.data));
        return true;
      },
      error => {
        if (isUndefined(error)) next(result);
        return done(error);
      },
      context);
  };
}
