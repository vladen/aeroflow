'use strict';

import { reduceAlongOperator } from './reduce';

export function sumOperator() {
  return reduceAlongOperator((result, value) => result + value);
}
