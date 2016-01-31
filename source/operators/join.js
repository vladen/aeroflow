'use strict';

import { reduceGeneralOperator, reduceOptionalOperator } from './reduce';
import { constant, isFunction, isUndefined, isString } from '../utilites';

export function joinOperator(separator, optional) {
  const joiner = isFunction(separator)
    ? separator
    : isUndefined(separator)
      ? constant(',')
      : constant(separator);
  return (optional ? reduceOptionalOperator : reduceGeneralOperator)(
    (result, value, index, data) => result.length
      ? result + joiner(value, index, data) + value 
      : value,
    '');
}
