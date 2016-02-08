'use strict';

import { toFunction, truthy} from '../utilites';
import { arrayAdapter } from '../adapters/array';
import { adapterSelector } from '../adapters/index';
import { scalarAdapter } from '../adapters/scalar';
import { toArrayOperator } from './toArray';
import { filterOperator } from './filter';
import { mapOperator } from './map';

export function joinOperator(right, condition) {
  const
    comparer = toFunction(condition, truthy),
    toArray = toArrayOperator()(adapterSelector(right, scalarAdapter(right)));
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
