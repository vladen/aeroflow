'use strict';

import { reduceOperator } from './reduce';

export function averageOperator() {
  return reduceOperator((average, result, index) => (average * index + result) / (index + 1));
}
