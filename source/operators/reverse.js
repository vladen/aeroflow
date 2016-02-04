'use strict';

import { toArrayOperator } from './toArray';

export function reverseOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    result => next(result.reverse()),
    done,
    context);
}
