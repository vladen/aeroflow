'use strict';

import { identity, isUndefined, toFunction } from '../utilites';

export function mapOperator(mapper) {
  if (isUndefined(mapper)) return identity;
  mapper = toFunction(mapper);
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => next(mapper(value, index++, context.data)),
      done,
      context);
  };
}
