'use strict';

import { maxInteger, toNumber } from '../utilites';
import { unsync } from '../unsync';
import { scalarAdapter } from '../adapters/scalar';

export function rangeGenerator(start, end, step) {
  end = toNumber(end, maxInteger);
  start = toNumber(start, 0);
  if (start === end) return scalarAdapter(start);
  const down = start < end;
  if (down) {
    step = toNumber(step, 1);
    if (step < 1) return scalarAdapter(start);
  }
  else {
    step = toNumber(step, -1);
    if (step > -1) return scalarAdapter(start);
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
