'use strict';

import { reduceOperator } from './reduce';

export function sumOperator(required) {
  return reduceOperator(
    (sum, result) => +result + sum, 
    0,
    required);
}
