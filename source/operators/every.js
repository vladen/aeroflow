import { FUNCTION, REGEXP, UNDEFINED } from '../symbols';
import { classOf, isError } from '../utilites';
import { unsync } from '../unsync';

export function everyOperator(condition) {
  let predicate;
  switch (classOf(condition)) {
    case FUNCTION:
      predicate = condition;
      break;
    case REGEXP:
      predicate = result => condition.test(result);
      break;
    case UNDEFINED:
      predicate = result => !!result;
      break;
    default:
      predicate = result => result === condition;
      break;
  }
  return emitter => (next, done, context) => {
    let empty = true, every = true, index = 0;
    emitter(
      result => {
        empty = false;
        if (predicate(result, index++, context.data)) return true;
        return every = false;
      },
      result => {
        if (isError(result) || !unsync(next(every || empty), done, done)) done(result);
      },
      context);
  };
}
