import { ERROR, PROMISE } from './symbols';
import { classOf, toError } from './utilites';

export function unsync(result, next, done) {
  switch (result) {
    case true:
      return false;
    case false:
      done(false);
      return true;
  }
  switch (classOf(result)) {
    case PROMISE:
      result.then(
        promiseResult => {
          if (!unsync(promiseResult, next, done)) next(true);
        },
        promiseError => done(toError(promiseError)));
      break;
    case ERROR:
      done(result);
      break;
  }
  return true;
}
