'use strict';

import { constant, isFunction } from '../utilites';
import { unsync } from '../unsync';

export function expandEmitter(expanding, seed) {
  const expander = isFunction(expanding)
    ? expanding
    : constant(expanding);
  return (next, done, context) => {
    let index = 0, value = seed;
    !function proceed() {
      while (!unsync(next(expander(value, index++, context.data))), proceed, done);
    }();
  };
}
