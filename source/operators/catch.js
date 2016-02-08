'use strict';

import { isDefined, isError } from '../utilites';
import { adapterSelector } from '../adapters/index';
import { scalarAdapter } from '../adapters/scalar';
import { emptyEmitter } from '../emitters/empty';

export function catchOperator(alternative) {
  const regressor = isDefined(alternative) 
    ? adapterSelector(alternative, scalarAdapter(alternative))
    : emptyEmitter(false);
  return emitter => (next, done, context) => emitter(
    next,
    result => isError(result)
      ? regressor(next, done, context)
      : done(result),
    context);
} 
