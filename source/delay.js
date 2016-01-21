'use strict';

import { Aeroflow } from './aeroflow';
import { EMITTER } from './symbols';
import { dateNow, isDate, isFunction, mathMax } from './utilites';

const delayEmitter = (emitter, interval) => (next, done, context) => emitter(
  value => new Promise(resolve =>
    setTimeout(
      () => resolve(next(value)),
      interval)),
  error => new Promise(resolve =>
    setTimeout(
      () => resolve(done(error)),
      interval)),
  context);

const delayDynamicEmitter = (emitter, selector) => (next, done, context) => {
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
      return new Promise(resolve => setTimeout(
        () => resolve(next(value)),
        mathMax(interval, 0)));
    },
    error => {
      completition -= dateNow();
      return new Promise(resolve => setTimeout(
        () => resolve(done(error)),
        mathMax(completition, 0)));
    },
    context);
};

/**
  * Returns new flow delaying emission of each value accordingly provided condition.
  *
  * @param {number|date|function} [condition] The condition used to determine delay for each subsequent emission.
  *   Number is threated as milliseconds interval (negative number is considered as 0).
  *   Date is threated as is (date in past is considered as now).
  *   Function is execute for each emitted value, with three arguments:
  *     value - The current value emitted by this flow
  *     index - The index of the current value
  *     context - The context object
  *   The result of condition function will be converted nu number and used as milliseconds interval.
  *
  * @example:
  * aeroflow(1).delay(500).dump().run();
  * // next 1 // after 500ms
  * // done
  * aeroflow(1, 2).delay(new Date + 500).dump().run();
  * // next 1 // after 500ms
  * // next 2
  * // done
  * aeroflow([1, 2, 3]).delay((value, index) => index * 500).dump().run();
  * // next 1
  * // next 2 // after 500ms
  * // next 3 // after 1000ms
  * // done
  */
function delay(condition) {
  return new Aeroflow(isFunction(condition)
    ? delayDynamicEmitter(
        this[EMITTER],
        condition)
    : isDate(condition)
      ? delayDynamicEmitter(
          this[EMITTER],
          () => mathMax(condition - new Date, 0))
      : delayEmitter(
          this[EMITTER],
          mathMax(+condition || 0, 0)));
}

export { delay, delayDynamicEmitter, delayEmitter };
