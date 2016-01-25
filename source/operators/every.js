'use strict';

import { FUNCTION, REGEXP, UNDEFINED } from '../symbols';
import { classOf } from '../utilites';

export function everyOperator(condition) {
  let predicate;
  switch (classOf(condition)) {
    case FUNCTION:
      predicate = condition;
      break;
    case REGEXP:
      predicate = value => condition.test(value);
      break;
    case UNDEFINED:
      predicate = value => !!value;
      break;
    default:
      predicate = value => value === condition;
      break;
  }
  return emitter => (next, done, context) => {
    let idle = true, result = true;
    context = context.spawn();
    emitter(
      value => {
        idle = false;
        if (predicate(value)) return;
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
