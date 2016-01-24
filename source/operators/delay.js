'use strict';

import { dateNow, isDate, isFunction, mathMax } from '../utilites';

export function delayDynamicOperator(emitter, selector) {
  return emitter => (next, done, context) => {
    let completition = dateNow(), index = 0;
    emitter(
      value => {
        let interval = selector(value, index++, context.data), estimation;
        if (isDate(interval)) {
          estimation = interval;
          interval = interval - dateNow();
        }
        else estimation = dateNow() + interval;
        if (completition < estimation)
          completition = estimation;
        setTimeout(() => resolve(next(value)), mathMax(interval, 0));
      },
      error => {
        completition -= dateNow();
        setTimeout(() => resolve(done(error)), mathMax(completition, 0));
      },
      context);
  };
}

export function delayStaticOperator(emitter, interval) {
  return emitter => (next, done, context) => emitter(
    value => setTimeout(() => next(value), interval),
    error => setTimeout(() => done(error), interval),
    context);
}

export function delayOperator(condition) {
  return isFunction(condition)
    ? delayDynamicOperator(condition)
    : isDate(condition)
      ? delayDynamicOperator(() => mathMax(condition - new Date, 0))
      : delayStaticOperator(mathMax(+condition || 0, 0));
}
