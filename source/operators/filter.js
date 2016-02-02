'use strict';

import { FUNCTION, REGEXP, UNDEFINED } from '../symbols';
import { classOf } from '../utilites';

export function filterOperator(condition) {
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
      predicate = value => value === condition
      break;
  }
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => !predicate(value, index++, context.data) || next(value),
      done,
      context);
  };
}