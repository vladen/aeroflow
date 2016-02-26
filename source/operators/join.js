import { toFunction, truthy} from '../utilites';
import { arrayAdapter } from '../adapters/array';
import { selectAdapter } from '../adapters/index';
import { toArrayOperator } from './toArray';
import { filterOperator } from './filter';
import { mapOperator } from './map';

// todo: laziness, early results
export function joinOperator(right, condition) {
  const
    comparer = toFunction(condition, truthy),
    toArray = toArrayOperator()(selectAdapter(right));
  return emitter => (next, done, context) => toArray(
    rightArray => new Promise(rightResolve => emitter(
      leftResult => new Promise(leftResolve => {
         const
          array = arrayAdapter(rightArray),
          filter = filterOperator(rightResult => comparer(leftResult, rightResult)),
          map = mapOperator(rightResult => [leftResult, rightResult]);
        return map(filter(array))(next, leftResolve, context);
      }),
      rightResolve,
      context)
    ),
    done,
    context);
}
