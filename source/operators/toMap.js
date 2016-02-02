'use strict';

import { constant, identity, isFunction, isUndefined, tie } from '../utilites';
import { unsync } from '../unsync';

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
    let index = 0, map = new Map;
    emitter(
      result => {
        map.set(
          keyTransformer(result, index++, context.data),
          valueTransformer(result, index++, context.data));
        return true;
      },
      result => {
        if (isError(result) || !desync(next(map), tie(done, result), done)) done(result);
      },
      context);
  };
}
