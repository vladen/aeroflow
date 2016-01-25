'use strict';

import { DATE, FUNCTION } from '../symbols';
import { classOf, dateNow, isDate, mathMax } from '../utilites';

export function delayDynamicOperator(selector) {
  return emitter => (next, done, context) => {
    let completition = dateNow(), index = 0;
    emitter(
      value => {
        let interval = selector(value, index++, context.data), estimation;
        if (isDate(interval)) {
          estimation = interval;
          interval = interval - dateNow();
        }
        // todo: convert interval to number
        else estimation = dateNow() + interval;
        if (completition < estimation) completition = estimation + 1;
        setTimeout(() => next(value), mathMax(interval, 0));
      },
      error => {
        completition -= dateNow();
        setTimeout(() => done(error), mathMax(completition, 0));
      },
      context);
  };
}

export function delayStaticOperator(interval) {
  return emitter => (next, done, context) => emitter(
    value => setTimeout(() => next(value), interval),
    error => setTimeout(() => done(error), interval),
    context);
}

export function delayOperator(condition) {
  switch (classOf(condition)) {
    case DATE:
      return delayDynamicOperator(() => mathMax(condition - new Date, 0));
    case FUNCTION:
      return delayDynamicOperator(condition);
    default:
      return delayStaticOperator(mathMax(+condition || 0, 0));
  }
}
