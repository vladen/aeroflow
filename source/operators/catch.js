'use strict';

import { isError } from '../utilites';
import { adapterEmitter } from '../emitters/adapter';

export function catchOperator(alternative) {
  return emitter => (next, done, context) => emitter(
    next,
    result => {
      if (isError(result)) adapterEmitter(alternative, true)(next, done, context);
      else done(result);
    },
    context);
} 
