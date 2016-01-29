'use strict';

import { reduceGeneralOperator } from './reduce';

export function sumOperator() {
  return reduceGeneralOperator((result, value) => result + value, 0);
}
