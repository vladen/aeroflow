'use strict';

import { reduceGeneralOperator } from './reduce';

export function averageOperator() {
  let count = 0;
  return reduceGeneralOperator((result, value) => {
  	count++;
    return (result * (count - 1) + value) / count;
  }, 0);
}