'use strict';

import { reduceGeneralOperator } from './reduce';

export function countOperator() {
  return emitter => reduceGeneralOperator(emitter, result => result + 1, 0);
} 
