'use strict';

import { reduceAlongOperator } from './reduce';

export function averageOperator() {
  return reduceAlongOperator(
    (result, value, index) => (result * index + value) / (index + 1));
}