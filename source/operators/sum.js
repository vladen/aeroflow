'use strict';

import { reduceGeneralOperator } from './reduce';

export function sumOperator() {
  return emitter => reduceGeneralOperator((result, value) => result + value, 0);
}
