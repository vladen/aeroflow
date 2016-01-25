'use strict';

export function promiseEmitter(source) {
  return (next, done, context) => source.then(
    value => {
      next(value);
      done();
    },
    error => done(error));
}
