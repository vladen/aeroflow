'use strict';

import { isNothing } from '../utilites';

export function toSetOperator() {
  return emitter => (next, done, context) => {
    let result = new Set;
    emitter(
      value => {
        result.add(value);
        return true;
      },
      error => {
        if (isNothing(error)) next(result);
        return done(error);
      },
      context);
  };
}
