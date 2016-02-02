'use strict';

import { isUndefined, tie } from '../utilites';
import { unsync } from '../unsync';

export function toArrayOperator() {
  return emitter => (next, done, context) => {
    let array = [];
    emitter(
      result => {
        array.push(result);
        return true;
      },
      result => {
        if (isError(result) || !defer(next(array), tie(done, result), done)) done(result);
      },
      context);
  };
}
