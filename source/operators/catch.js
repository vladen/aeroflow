'use strict';

import { isDefined, isError } from '../utilites';
import { adapterEmitter } from '../emitters/adapter';

export function catchOperator(alternative) {
  return emitter => (next, done, context) => emitter(
    next,
    result => {
      if (isError(result))
        if (isDefined(alternative)) adapterEmitter(alternative, true)(next, done, context);
        else done(false);
      else done(result);
    },
    context);
} 
