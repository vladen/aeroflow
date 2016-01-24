'use strict';

export function promiseEmitter(source) {
  return (next, done, context) => source.then(
    value => next(value),
    error => done(error));
}
