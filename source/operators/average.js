'use strict';

import { reduceOperator } from './reduce';

export function averageOperator(required) {
  return reduceOperator(
    (average, result, index) => (average * index + result) / (index + 1), 0);
}
