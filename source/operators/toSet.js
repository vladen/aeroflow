import { isError, tie } from '../utilites';
import { unsync } from '../unsync';

export function toSetOperator() {
  return emitter => (next, done, context) => {
    const set = new Set;
    emitter(
      result => {
        set.add(result);
        return true;
      },
      result => {
        if (isError(result) || !unsync(next(set), tie(done, result), done)) done(result);
      },
      context);
  };
}
