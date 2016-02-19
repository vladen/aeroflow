import { isDefined, isError } from '../utilites';
import { adapt } from '../adapt';
import { emptyGenerator } from '../generators/empty';

export function catchOperator(alternate) {
  alternate = isDefined(alternate) 
    ? adapt(alternate)
    : emptyGenerator(false);
  return emitter => (next, done, context) => emitter(
    next,
    result => isError(result)
      ? alternate(next, done, context)
      : done(result),
    context);
} 
