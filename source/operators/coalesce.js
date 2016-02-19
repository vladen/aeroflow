import { identity, isError } from '../utilites';
import { adapt } from '../adapt';

export function coalesceOperator(alternates) {
  if (!alternates.length) return identity;
  return emitter => (next, done, context) => {
    let empty = true, index = 0;
    emitter(onNext, onDone, context);
    function onDone(result) {
      if (!isError(result) && empty && index < alternates.length)
        adapt(alternates[index++])(onNext, onDone, context);
      else done(result);
    }
    function onNext(result) {
      empty = false;
      return next(result);
    }
  }
}
