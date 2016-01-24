'use strict';

import { isFunction } from '../utilites';

export function expandEmitter(expander, seed) {
  return (next, done, context) => {
    let index = 0, value = seed;
    while (context.active) next(value = expander(value, index++, context.data));
    done();
  };
}
