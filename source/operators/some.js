'use strict';

import { isFunction, isRegExp } from '../utilites';

export function someOperator(condition) {
  const predicate = isFunction(condition)
    ? condition
    : isRegExp(condition)
      ? value => condition.test(value)
      : value => value === condition;
  return emitter => (next, done, context) => {
    let result = false;
    context = context.spawn();
    emitter(
      value => {
        if (!predicate(value)) return;
        result = true;
        context.done();
      },
      error => {
        next(result);
        done(error);
      },
      context);
  };
}
