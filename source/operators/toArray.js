'use strict';

import { isNothing } from '../utilites';

export function toArrayOperator() {
  return emitter => (next, done, context) => {
    const result = [];
    emitter(
      value => {
        result.push(value)
        return true;
      },
      error => {
        if (isNothing(error)) next(result);
        return done(error);
      },
      context);
  };
}
