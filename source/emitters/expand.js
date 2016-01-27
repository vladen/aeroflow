'use strict';

import { constant, isFunction } from '../utilites';

export function expandEmitter(expanding, seed) {
  const expander = isFunction(expanding)
    ? expanding
    : constant(expanding);
  return (next, done, context) => {
    let index = 0, value = seed;
    while (next(expander(value, index++, context.data)));
    done();
  };
}
