'use strict';

import { reduceGeneralOperator, reduceOptionalOperator } from './reduce';
import { isFunction, isNothing, isString } from '../utilites';

export function joinOperator(separator, optional) {
  const joiner = isFunction(separator)
    ? separator
    : isNothing(separator)
      ? () => ','
      : () => separator;
  return (optional ? reduceOptionalOperator : reduceGeneralOperator)(
    (result, value, index, data) => result.length
      ? result + joiner(value, index, data) + value 
      : value,
    '');
}
