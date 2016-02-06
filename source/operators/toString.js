'use strict';

import { reduceOperator } from './reduce';
import { constant, isUndefined, toFunction } from '../utilites';

export function toStringOperator(separator) {
  const joiner = isUndefined(separator)
    ? constant(',')
    : toFunction(separator, constant(separator));
  return reduceOperator((string, result, index, data) =>
    string + joiner(result, index, data) + result, undefined, false);
}
