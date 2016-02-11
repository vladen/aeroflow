'use strict';

import { isError, tie } from '../utilites';
import { unsync } from '../unsync';

export function toSetOperator(required) {
  return emitter => (next, done, context) => {
    let empty = !required, set = new Set;
    emitter(
      result => {
        empty = false;
        set.add(result);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(set), tie(done, result), done))
          done(result);
      },
      context);
  };
}
