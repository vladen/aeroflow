'use strict';

import { isFunction } from './utilites';

export function tapOperator(callback) {
  return emitter => isFunction(callback)
    ? (next, done, context) => {
      let index = 0;
      emitter(
        value => {
          callback(value, index++, context.data);
          return next(value);
        },
        done,
        context);
    }
    : emitter;
}
