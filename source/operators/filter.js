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
      predicate = result => condition.test(result);
      break;
    case UNDEFINED:
      predicate = result => !!result;
      break;
    default:
      predicate = result => result === condition
      break;
  }
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      result => !predicate(result, index++, context.data) || next(result),
      done,
      context);
  };
}
