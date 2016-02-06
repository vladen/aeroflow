'use strict';

import { reduceOperator } from './reduce';

export function maxOperator (optional) {
  return reduceOperator((maximum, result) => maximum < result ? result : maximum);
}
