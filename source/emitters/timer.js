'use strict';

import { emptyEmitter } from './empty';
import { unsync } from '../unsync';

export function timerEmitter(interval) {
  interval = +interval;
  if (isNaN(interval) || interval < 0) interval = 0;
  return (next, done, context) => {
    !function delay() {
      setTimeout(proceed, interval);
    }();
    function proceed(result) {
      if (!unsync(next(new Date), delay, done)) delay();
    }
  };
}
