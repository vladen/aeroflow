import { isError, tie } from '../utilites';
import { unsync } from '../unsync';

export function toArrayOperator() {
  return emitter => (next, done, context) => {
    const array = [];
    emitter(
      result => {
        array.push(result);
        return true;
      },
      result => {
        if (isError(result) || !unsync(next(array), tie(done, result), done)) done(result);
      },
      context);
  };
}
