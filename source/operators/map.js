'use strict';

import { constant, identity, isFunction, isUndefined } from '../utilites';

export function mapOperator(mapping) {
  if (isUndefined(mapping)) return identity;
  const mapper = isFunction(mapping)
    ? mapping
    : constant(mapping);
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => next(mapper(value, index++, context.data)),
      done,
      context);
  };
}
