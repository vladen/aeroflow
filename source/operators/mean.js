import { mathFloor } from '../utilites';
import { toArrayOperator } from './toArray';

export function meanOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    result => {
      if (!result.length) return true;
      result.sort();
      return next(result[mathFloor(result.length / 2)]);
    },
    done,
    context);
}
