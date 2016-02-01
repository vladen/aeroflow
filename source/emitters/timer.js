'use strict';

import { isPromise, isTrue } from '../utilites';
import { emptyEmitter } from './empty';

export function timerEmitter(interval) {
  interval = +interval;
  return isNaN(interval) 
    ? emptyEmitter()
    : (next, done, context) => {
        let index = 0;
        !function proceed(result) {
          if (isTrue(result))
            setTimeout(() => proceed(next(new Date, index++)), interval);
          else if (isPromise(result))
            result.then(proceed, proceed);
          else done(result);
        }(true);
      };
}
