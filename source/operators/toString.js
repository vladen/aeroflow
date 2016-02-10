'use strict';

import { BOOLEAN, FUNCTION, UNDEFINED } from '../symbols';
import { classOf, constant, toFunction } from '../utilites';
import { reduceOperator } from './reduce';

export function toStringOperator(separator, optional) {
  let joiner;
  /*eslint no-fallthrough: 0*/
  switch (classOf(separator)) {
    case FUNCTION:
      joiner = separator;
      break;
    case BOOLEAN:
      optional = separator;
    case UNDEFINED:
      separator = ',';
    default:
      joiner = constant(separator);
      break;
  }
  return reduceOperator((string, result, index, data) =>
    string.length
      ? string + joiner(result, index, data) + result
      : '' + result,
    optional ? undefined : '');
}
