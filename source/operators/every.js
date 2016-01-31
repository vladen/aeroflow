'use strict';

import { FUNCTION, REGEXP, UNDEFINED } from '../symbols';
import { classOf, isUndefined } from '../utilites';

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
    emitter(
      value => {
        idle = false;
        if (predicate(value)) return true;
        return result = false;
      },
      error => {
        if (isUndefined(error)) next(result && !idle);
        return done(error);
      },
      context);
  };
}
