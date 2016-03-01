import { constant, identity, isError, isFunction, isUndefined, tie, toFunction } from '../utilites';
import { unsync } from '../unsync';
import { valueAdapter } from '../adapters/value';

export function reduceOperator(reducer, seed, forced) {
  if (isUndefined(reducer)) {
    reducer = identity;
    seed = constant();
  }
  else if (isFunction(reducer)) seed = toFunction(seed);
  else return tie(valueAdapter, reducer);
  return emitter => (next, done, context) => {
    let empty = !forced, index = 0, reduced = seed(context.data);
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
