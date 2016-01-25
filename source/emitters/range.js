'use strict';

export function rangeEmitter(inclusiveStart, inclusiveEnd, step) {
  return (next, done, context) => {
    let i = inclusiveStart - step;
    if (inclusiveStart < inclusiveEnd)
      while (context.active && (i += step) <= inclusiveEnd) next(i);
    else while (context.active && (i += step) >= inclusiveEnd) next(i);
    done();
  };
}
