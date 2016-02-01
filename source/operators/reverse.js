'use strict';

import { toArrayOperator } from './toArray';

export function reverseOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    value => {
      for (let index = value.length; index--;) next(value[index]);
      return false;
    },
    done,
    context);
}
