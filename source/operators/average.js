'use strict';

import { reduceGeneralOperator, reduceOptionalOperator } from './reduce';

export function averageOperator(optional) {
  const reducer = optional
    ? reduceOptionalOperator
    : reduceGeneralOperator;
  let count = 0;
  return reducer((result, value) => {
  	count++;
    return (result * (count - 1) + value) / count;
  }, 0);
}