import { identity, isError, isUndefined, tie, toFunction } from '../utilites';
import unsync from '../unsync';

export default function toMapOperator(keySelector, valueSelector) {
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
          keySelector(result, index++),
          valueSelector(result, index++));
        return true;
      },
      result => {
        if (isError(result) || !unsync(next(map), tie(done, result), done)) done(result);
      },
      context);
  };
}
