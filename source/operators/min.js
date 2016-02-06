'use strict';

import { reduceOperator } from './reduce';

export function minOperator(optional) {
  return reduceOperator((minimum, result) => minimum > result ? result : minimum);
}
