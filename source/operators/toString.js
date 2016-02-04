'use strict';

import { reduceGeneralOperator, reduceOptionalOperator } from './reduce';
import { constant, isFunction, isUndefined, isString } from '../utilites';

export function toStringOperator(separator, optional) {
  const joiner = isUndefined(separator)
    ? constant(',')
    : isFunction(separator)
      ? separator
      : constant(separator);
  const reducer = optional
    ? reduceOptionalOperator
    : reduceGeneralOperator;
  return reducer((result, value, index, data) =>
    result.length
      ? result + joiner(value, index, data) + value
      : '' + value,
    '');
}
