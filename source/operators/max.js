'use strict';

import { reduceOperator } from './reduce';

export function maxOperator (required) {
  return reduceOperator((maximum, result) => maximum < result ? result : maximum);
}
