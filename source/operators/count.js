'use strict';

import { reduceGeneralOperator, reduceOptionalOperator } from './reduce';

export function countOperator(optional) {
  const reducer = optional
    ? reduceOptionalOperator
    : reduceGeneralOperator;
  return reducer(result => result + 1, 0);
} 
