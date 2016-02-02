'use strict';

import { reduceAlongOperator } from './reduce';

export function minOperator() {
  return reduceAlongOperator((minimum, value) => value < minimum ? value : minimum);
}
