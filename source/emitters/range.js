'use strict';

import { isNumber, maxInteger, toNumber } from '../utilites';
import { unsync } from '../unsync';
import { scalarEmitter } from './scalar';

export function rangeEmitter(start, end, step) {
  end = toNumber(end, maxInteger);
  start = toNumber(start, 0);
  if (start === end) return scalarEmitter(start);
  const down = start < end;
  if (down) {
    step = toNumber(step, 1);
    if (step < 1) return scalarEmitter(start);
  }
  else {
    step = toNumber(step, -1);
    if (step > -1) return scalarEmitter(start);
  }
  const limiter = down
    ? value => value >= end
    : value => value <= end;
  return (next, done, context) => {
    let value = start - step;
    !function proceed() {
      while ((value += step) <= end)
        if (unsync(next(value), proceed, done))
          return;
      done(true);
    }();
  };
}
