import { identity, isError, isUndefined, tie, toFunction } from '../utilites';
import { unsync } from '../unsync';

export function toMapOperator(keySelector, valueSelector) {
  keySelector = isUndefined(keySelector)
    ? identity
    : toFunction(keySelector);
  valueSelector = isUndefined(valueSelector)
    ? identity
    : toFunction(valueSelector);
  return emitter => (next, done, context) => {
    const map = new Map;
    let index = 0;
    emitter(
      result => {
        map.set(
          keySelector(result, index++, context.data),
          valueSelector(result, index++, context.data));
        return true;
      },
      result => {
        if (isError(result) || !unsync(next(map), tie(done, result), done)) done(result);
      },
      context);
  };
}
