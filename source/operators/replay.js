'use strict';

import { dateNow, isError, toFunction, toNumber, tie } from '../utilites';
import { unsync } from '../unsync';

export function replayOperator(interval, timing) {
  const delayer = toFunction(interval);
  return emitter => (next, done, context) => {
    let past = dateNow();
    const chronicles = [], chronicler = timing
      ? result => {
          const now = dateNow(), chronicle = { delay: now - past, result };
          past = now;
          return chronicle;
        }
      : result => ({ delay: 0, result });
    emitter(
      result => {
        chronicles.push(chronicler(result));
        return next(result);
      },
      result => {
        if (isError(result)) done(result);
        else {
          let index = -1;
          !function proceed(proceedResult) {
            if (unsync(proceedResult, proceed, tie(done, proceedResult))) return;
            index = (index + 1) % chronicles.length;
            const chronicle = chronicles[index];
            interval = index
              ? chronicle.delay
              : chronicle.delay + toNumber(delayer(context.data), 0);
            (interval ? setTimeout : setImmediate)(() => {
              if (!unsync(next(chronicle.result), proceed, proceed)) proceed(true);
            }, interval);
          }(true);
        }
      },
      context);
  };
}
