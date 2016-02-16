'use strict';

import { maxInteger, toNumber } from '../utilites';
import { unsync } from '../unsync';
import { valueAdapter } from '../adapters/value';

export function rangeGenerator(start, end, step) {
  end = toNumber(end, maxInteger);
  start = toNumber(start, 0);
  if (start === end) return valueAdapter(start);
  const down = start < end;
  if (down) {
    step = toNumber(step, 1);
    if (step < 1) return valueAdapter(start);
  }
  else {
    step = toNumber(step, -1);
    if (step > -1) return valueAdapter(start);
  }
  const limiter = down
    ? value => value <= end
    : value => value >= end;
  return (next, done, context) => {
    let value = start - step;
    !function proceed() {
      while (limiter(value += step))
        if (unsync(next(value), proceed, done))
          return;
      done(true);
    }();
  };
}
