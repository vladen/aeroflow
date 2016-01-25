'use strict';

import { isFunction, isNothing, isRegExp } from '../utilites';

export function everyOperator(condition) {
  const predicate = isFunction(condition)
    ? condition
    : isRegExp(condition)
      ? value => condition.test(value)
      : value => value === condition;
  return emitter => (next, done, context) => {
    let idle = true, result = true;
    context = context.spawn();
    emitter(
      value => {
        idle = false;
        if (!predicate(value)) return;
        result = false;
        context.done();
      },
      error => {
        next(result && !idle);
        done(error);
      },
      context);
  };
}
