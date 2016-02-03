'use strict';

import { reduceGeneralOperator, reduceOptionalOperator } from './reduce';
import { constant, isFunction, isUndefined, isString } from '../utilites';

export function joinOperator(separator, optional) {
  const joiner = isFunction(separator)
    ? separator
    : isUndefined(separator)
      ? constant(',')
      : constant(separator);
  const reducer = optional
    ? reduceOptionalOperator
    : reduceGeneralOperator;
  return reducer((result, value, index, data) =>
    result.length
      ? result + joiner(value, index, data) + value
      : value,
    '');
}
