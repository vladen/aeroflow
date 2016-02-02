'use strict';

import { ERROR, PROMISE } from './symbols';
import { classOf } from './utilites';

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
      result.then(promiseResult => {
        if (!unsync(promiseResult, next, done)) next(true);
      }, done);
      break;
    case ERROR:
      done(result);
      break;
  }
  return true;
}
