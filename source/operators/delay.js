'use strict';

import { DATE, FUNCTION, NUMBER } from '../symbols';
import { classOf, constant, dateNow, isFunction, mathMax } from '../utilites';

export function delayOperator(condition) {
  const delayer = isFunction(condition)
    ? condition
    : constant(condition);
  return emitter => (next, done, context) => {
    let buffer = [], completed = false, delivering = false, index = 0;
    function schedule(action, argument) {
      if (delivering) {
        buffer.push([action, argument]);
        return;
      }
      delivering = true;
      let interval = delayer(argument, index++, context.data);
      switch (classOf(interval)) {
        case DATE:
          interval = interval - dateNow();
          break;
        case NUMBER:
          break;
        default:
          interval = +interval;
      }
      if (interval < 0) interval = 0;
      setTimeout(() => {
        delivering = false;
        if (!action(argument)) {
          completed = true;
          buffer.length = 0;
        }
        else if (buffer.length) schedule.apply(null, buffer.shift());
      }, interval);
    };
    return emitter(
      value => {
        if (completed) return false;
        schedule(next, value);
        return true;
      },
      error => {
        completed = true;
        schedule(done, error);
      },
      context);
  }
}
