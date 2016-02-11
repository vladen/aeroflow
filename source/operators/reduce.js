'use strict';

import { isError, isBoolean, isFunction, isUndefined, tie } from '../utilites';
import { unsync } from '../unsync';
import { scalarAdapter } from '../adapters/scalar';
import { emptyGenerator } from '../generators/empty';

export function reduceOperator(reducer, seed, required) {
  if (isUndefined(reducer)) return tie(emptyGenerator, false);
  if (!isFunction(reducer)) return tie(scalarAdapter, reducer);
  return emitter => (next, done, context) => {
    let empty = !required, index = 0, reduced = seed;
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
