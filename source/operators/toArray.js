'use strict';

export function toArrayOperator() {
  return emitter => (next, done, context) => {
    let result = [];
    emitter(
      value => result.push(value),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}
