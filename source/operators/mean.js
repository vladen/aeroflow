'use strict';

import { mathFloor } from '../utilites';
import { toArrayOperator } from './toArray';

export function meanOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    values => {
      if (!values.length) return;
      values.sort();
      next(values[mathFloor(values.length / 2)]);
    },
    done,
    context);
}
