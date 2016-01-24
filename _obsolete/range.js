'use strict';

import { flow } from './flow';
import { just } from './just';
import { maxInteger } from './utilites';

const rangeEmitter = (inclusiveStart, inclusiveEnd, step) => (next, done, context) => {
  let i = inclusiveStart - step;
  if (inclusiveStart < inclusiveEnd)
    while (context.active && (i += step) <= inclusiveEnd)
      next(i);
  else
    while (context.active && (i += step) >= inclusiveEnd)
      next(i);
  done();
};

/*
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
const range = (inclusiveStart, inclusiveEnd, step) => {
  inclusiveEnd = +inclusiveEnd || maxInteger;
  inclusiveStart = +inclusiveStart || 0;
  step = +step || (inclusiveStart < inclusiveEnd ? 1 : -1);
  return inclusiveStart === inclusiveEnd
    ? just(inclusiveStart)
    : flow(rangeEmitter(inclusiveStart, inclusiveEnd, step));
};

export { range, rangeEmitter };
