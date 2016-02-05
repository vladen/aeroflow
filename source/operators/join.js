'use strict';

import { isError, toFunction, truthy} from '../utilites';
import { arrayEmitter } from '../emitters/array';
import { adapterEmitter } from '../emitters/adapter';
import { toArrayOperator } from './toArray';
import { filterOperator } from './filter';
import { mapOperator } from './map';

export function joinOperator(right, condition) {
  const
    comparer = toFunction(condition, truthy),
    toArray = toArrayOperator()(adapterEmitter(right, true));
  return emitter => (next, done, context) => toArray(
    rightArray => new Promise(rightResolve => emitter(
      leftResult => new Promise(leftResolve => {
         const
          array = arrayEmitter(rightArray),
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
