'use strict';

import { isError, isBoolean, isFunction, isUndefined, tie } from '../utilites';
import { unsync } from '../unsync';
import { scalarAdapter } from '../adapters/scalar';
import { emptyEmitter } from '../emitters/empty';

export function reduceOperator(reducer, seed, required) {
  if (isUndefined(reducer)) return tie(emptyEmitter, false);
  if (!isFunction(reducer)) return tie(scalarAdapter, reducer);
  if (isUndefined(required) && isBoolean(seed)) {
    required = seed;
    seed = undefined;
  }
  return emitter => (next, done, context) => {
    let empty = !required, index = 1, reduced = seed;
    emitter(
      result => {
        if (empty) {
          empty = false;
          if (isUndefined(reduced)) {
            reduced = result;
            return true;
          }
        }
        reduced = reducer(reduced, result, index++, context.data);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(reduced), tie(done, result), done))
          done(result);
      },
      context);
  };
}
