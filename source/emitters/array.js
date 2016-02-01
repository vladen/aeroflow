'use strict';

import { isPromise, isTrue } from '../utilites';

export function arrayEmitter(source) {
  return (next, done, context) => {
    let index = -1;
    !function proceed(result) {
      if (isTrue(result)) while (++index < source.length) {
        result = next(source[index]);
        if (isPromise(result)) result.then(proceed, proceed);
        if (!isTrue(result)) break;
      }
      done(result);
    }(true);
  };
}
