'use strict';

import { BOOLEAN, FUNCTION, STRING } from '../symbols';
import { classOf, constant, toFunction } from '../utilites';
import { reduceOperator } from './reduce';

export function toStringOperator(separator, optional) {
  let joiner;
  switch (classOf(separator)) {
    case BOOLEAN:
      optional = separator;
      break;
    case FUNCTION:
      joiner = separator;
      break;
    default:
      joiner = constant(separator);
      break;
  }
  if (!joiner) joiner = constant(',');
  return reduceOperator((string, result, index, data) =>
    string.length
      ? string + joiner(result, index, data) + result
      : '' + result,
    optional ? undefined : '');
}
