'use strict';

import { isUndefined } from '../utilites';

export function toSetOperator() {
  return emitter => (next, done, context) => {
    let result = new Set;
    emitter(
      value => {
        result.add(value);
        return true;
      },
      error => {
        if (isUndefined(error)) next(result);
        return done(error);
      },
      context);
  };
}
