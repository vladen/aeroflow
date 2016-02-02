'use strict';

export function scalarEmitter(value) {
  return (next, done) => {
    next(value);
    done();
  };
}
