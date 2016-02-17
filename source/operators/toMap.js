'use strict';

import { identity, isError, isUndefined, tie, toFunction } from '../utilites';
import { unsync } from '../unsync';

export function toMapOperator(keySelector, valueSelector, required) {
  keySelector = isUndefined(keySelector)
    ? identity
    : toFunction(keySelector);
  valueSelector = isUndefined(valueSelector)
    ? identity
    : toFunction(valueSelector);
  return emitter => (next, done, context) => {
    let empty = !required, index = 0, map = new Map;
    emitter(
      result => {
        empty = false;
        map.set(
          keySelector(result, index++, context.data),
          valueSelector(result, index++, context.data));
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(map), tie(done, result), done)) done(result);
      },
      context);
  };
}
