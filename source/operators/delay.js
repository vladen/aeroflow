'use strict';

import { DATE, FUNCTION, NUMBER } from '../symbols';
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
        let interval = delayer(result, index++, context.data);
        switch (classOf(interval)) {
          case DATE:
            interval = interval - dateNow();
            break;
          case NUMBER:
            break;
          default:
            interval = +interval;
            break;
        }
        if (interval < 0) interval = 0;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!unsync(next(result), resolve, reject)) resolve(true);
          }, interval);
        });
      },
      done,
      context);
  }
}
