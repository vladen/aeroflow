'use strict';

import { isDefined, isError } from '../utilites';
import { adapt } from '../adapt';

export function catchOperator(alternative) {
  const regressor = isDefined(alternative)
    ? adapt(alternative, true)
    : (next, done) => done(false);
  return emitter => (next, done, context) => emitter(
    next,
    result => isError(result)
      ? regressor(next, done, context)
      : done(result),
    context);
} 
