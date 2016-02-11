'use strict';

import { isError, tie } from '../utilites';
import { unsync } from '../unsync';

export function toArrayOperator(required) {
  return emitter => (next, done, context) => {
    let array = [], empty = !required;
    emitter(
      result => {
        empty = false;
        array.push(result);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(array), tie(done, result), done))
          done(result);
      },
      context);
  };
}
