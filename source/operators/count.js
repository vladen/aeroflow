'use strict';

import { reduceGeneralOperator, reduceOptionalOperator } from './reduce';

export function countOperator(optional) {
  return (optional ? reduceOptionalOperator : reduceGeneralOperator)(
  	result => result + 1,
  	0);
} 
