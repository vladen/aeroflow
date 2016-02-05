'use strict';

import { constant, isDefined, toDelay, toFunction } from '../utilites';
import { unsync } from '../unsync';

export function repeatDeferredEmitter(repeater, delayer) {
  return (next, done, context) => {
    let index = -1;
    !function proceed(result) {
      setTimeout(() => {
        if (!unsync(next(repeater(index, context.data)), proceed, done)) proceed();
      }, toDelay(delayer(++index, context.data), 1000));
    }();
  };
}

export function repeatImmediateEmitter(repeater) {
  return (next, done, context) => {
    let index = 0;
    !function proceed() {
      while (!unsync(next(repeater(index++, context.data)), proceed, done));
    }();
  };
}

export function repeatEmitter(value, interval) {
  const repeater = toFunction(value, constant(value));
  return isDefined(interval)
    ? repeatDeferredEmitter(repeater, toFunction(interval, constant(interval)))
    : repeatImmediateEmitter(repeater);
}
