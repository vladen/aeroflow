import { isDefined, isError, tie, toFunction } from '../utilites';
import { adapters } from '../adapters/index';
import { valueAdapter } from '../adapters/value';

export function catchOperator(alternative) {
  if (isDefined(alternative)) {
    alternative = toFunction(alternative);
    return emitter => (next, done, context) => emitter(
      next,
      result => {
        if (isError(result)) {
          const source = alternative(result, context.data);
          let adapter = adapters.get(source);
          if (!adapter) adapter = valueAdapter(source);
          adapter(next, tie(done, false), context);
        }
        else done(result);
      },
      context);
  }
  return emitter => (next, done, context) => emitter(
    next,
    result => done(!isError(result) && result),
    context);
}
