'use strict';

import { emptyEmitter } from './empty';

export function timerEmitter(interval) {
  interval = +interval;
  return isNaN(interval) 
    ? emptyEmitter()
    : (next, done, context) => {
        const timer = setInterval(
          () => {
            if (!next(new Date)) {
              clearInterval(timer);
              done();
            }
          },
          interval);
      };
}
