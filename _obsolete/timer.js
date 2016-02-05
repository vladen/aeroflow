'use strict';

import { constant, isFunction, toNumber } from '../utilites';
import { unsync } from '../unsync';

export function timerEmitter(interval) {
  if (!isFunction(interval)) interval = constant(interval);
  return (next, done, context) => {
    let index = 0;
    !function proceed(result) {
      setTimeout(() => {
        if (!unsync(next(new Date), proceed, done)) proceed();
      }, toNumber(interval(index++), 1000));
    }();
  };
}
