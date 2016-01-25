'use strict';

export function toSetOperator() {
  return emitter => (next, done, context) => {
    let result = new Set;
    emitter(
      value => {
        result.add(value)
      },
      error => {
        next(result);
        done(error);
      },
      context);
  };
}
