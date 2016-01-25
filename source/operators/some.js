'use strict';

import { FUNCTION, REGEXP, UNDEFINED } from '../symbols';
import { classOf } from '../utilites';

export function someOperator(condition) {
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
