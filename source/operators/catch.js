import { isDefined, isError, tie, toFunction } from '../utilites';
import adapters, { valueAdapter } from '../adapters/index';

export default function catchOperator(alternative) {
  if (isDefined(alternative)) {
    alternative = toFunction(alternative);
    return emitter => (next, done, context) => emitter(
      next,
      result => {
        if (isError(result)) {
          const source = alternative(result);
          (adapters.get(source) || valueAdapter(source))(next, tie(done, false), context);
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
