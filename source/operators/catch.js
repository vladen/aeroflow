'use strict';

import { isDefined, isError } from '../utilites';
import { adapterSelector } from '../adapters/index';
import { scalarAdapter } from '../adapters/scalar';
import { emptyGenerator } from '../generators/empty';

export function catchOperator(alternative) {
  const regressor = isDefined(alternative) 
    ? adapterSelector(alternative, scalarAdapter(alternative))
    : emptyGenerator(false);
  return emitter => (next, done, context) => emitter(
    next,
    result => isError(result)
      ? regressor(next, done, context)
      : done(result),
    context);
} 
