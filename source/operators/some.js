import { FUNCTION, REGEXP, UNDEFINED } from '../symbols';
import { classOf, isError } from '../utilites';
import unsync from '../unsync';

export default function someOperator(condition) {
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
    let some = false, index = 0;
    emitter(
      result => {
        if (!predicate(result, index++)) return true;
        some = true;
        return false;
      },
      result => {
        if (isError(result) || !unsync(next(some), done, done)) done(result);
      },
      context);
  };
}
