import { isError, toFunction } from '../utilites';
import { selectAdapter } from '../adapters/index';
import { emptyGenerator } from '../generators/empty';

export function catchOperator(alternative) {
  alternative = toFunction(alternative, alternative || []);
  return emitter => (next, done, context) => emitter(
    next,
    result => isError(result)
      ? selectAdapter(alternative(result, context.data))(next, done, context)
      : done(result),
    context);
} 
