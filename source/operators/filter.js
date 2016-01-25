'use strict';

import { isFunction, isNothing, isRegExp } from '../utilites';

export function filterOperator(condition) {
  const predicate = isFunction(condition)
    ? condition
    : isRegExp(condition)
      ? value => condition.test(value)
      : isNothing(condition)
        ? value => !!value
        : value => value === condition;
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => {
        if (predicate(value, index++, context.data)) next(value);
      },
      done,
      context);
  };
}
