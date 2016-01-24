'use strict';

export function valueEmitter(value) {
  return (next, done) => {
    next(value);
    done();
  };
}
