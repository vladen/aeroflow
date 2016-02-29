import { identity, isDefined, isError, toFunction } from '../utilites';
import { adapters } from '../adapters/index';
import { valueAdapter } from '../adapters/value';

export function coalesceOperator(alternative) {
  if (!isDefined(alternative)) return identity;
  alternative = toFunction(alternative);
  return emitter => (next, done, context) => {
    let empty = true;
    emitter(
      result => {
        empty = false;
        return next(result);
      },
      result => {
        if (!isError(result) && empty) {
          const source = alternative(context.data);
          let adapter = adapters.get(source);
          if (!adapter) adapter = valueAdapter(source);
          adapter(next, done, context);
        }
        else done(result);
      },
      context);
  }
}
