'use strict';

import { constant, isFunction } from '../utilites';
import { unsync } from '../unsync';

export function repeatEmitter(value) {
  const repeater = isFunction(value)
    ? value
    : constant(value);
  return (next, done, context) => {
    let index = 0;
    !function proceed() {
      while (!unsync(next(repeater(index++, context.data)), proceed, done));
    }();
  };
}
