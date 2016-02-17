'use strict';

import { reduceOperator } from './reduce';

export function sumOperator() {
  return reduceOperator((sum, result) => +result + sum, 0);
}
