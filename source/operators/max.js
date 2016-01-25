'use strict';

import { reduceAlongOperator } from './reduce';

export function maxOperator () {
  return reduceAlongOperator(
    (maximum, value) => value > maximum ? value : maximum);
}
