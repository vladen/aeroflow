import { identity, isDefined, isError, toFunction } from '../utilites';
import adapters, { valueAdapter } from '../adapters/index';

export default function coalesceOperator(alternative) {
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
          const source = alternative();
          (adapters.get(source) || valueAdapter(source))(next, done, context);
        }
        else done(result);
      },
      context);
  }
}
