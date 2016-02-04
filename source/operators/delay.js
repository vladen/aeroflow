'use strict';

import { DATE, ERROR, FUNCTION, NUMBER } from '../symbols';
import { classOf, constant, dateNow, isFunction, mathMax } from '../utilites';
import { unsync } from '../unsync';

export function delayOperator(interval) {
  const delayer = isFunction(interval)
    ? interval
    : constant(interval);
  return emitter => (next, done, context) => {
    let index = 0;
    return emitter(
      result => {
        let delay = delayer(result, index++, context.data);
        switch (classOf(delay)) {
          case DATE:
            delay = delay - dateNow();
            break;
          case NUMBER:
            break;
          case ERROR:
            return delay;
          default:
            delay = +delay;
            break;
        }
        if (delay < 0) delay = 0;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              if (!unsync(next(result), resolve, reject)) resolve(true);
            }
            catch (error) {
              reject(error);
            }
          }, delay);
        });
      },
      done,
      context);
  }
}
