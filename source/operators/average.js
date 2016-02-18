'use strict';

import { reduceOperator } from './reduce';

export function averageOperator(forced) {
  return reduceOperator((average, result, index) => (average * index + result) / (index + 1), 0, false);
}
