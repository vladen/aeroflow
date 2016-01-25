'use strict';

export function stopwatchEmitter() {
  return (next, done, context) {
    const interval = setInterval(() => {
      if (context.active) next(new Date);
      else {
        clearInterval(interval);
        done();
      }
    }, 1000);
  };
}
