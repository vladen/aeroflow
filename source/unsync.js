import { isPromise, toError } from './utilites';

export default function unsync(result, next, done) {
  switch (result) {
    case true:
      return false;
    case false:
      done(false);
      return true;
  }
  if (isPromise(result)) return result.then(
    promiseResult => {
      if (!unsync(promiseResult, next, done)) next(true);
    },
    promiseError => done(toError(promiseError)));
  done(result);
  return true;
}
