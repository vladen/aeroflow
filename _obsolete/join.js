'use strict';
 
import { isError, isFunction, truthy } from '../utilites';
import { arrayEmitter } from '../emitters/array';
import { adapterEmitter } from '../emitters/adapter';
import { toArrayOperator } from './toArray';
 
export function joinOperator(target, comparer) {
  if (!isFunction(comparer)) comparer = truthy;
  return emitter => (next, done, context) => toArrayOperator()(adapterEmitter(target, true))(
    rightArray => new Promise(rightResolve => emitter(
      leftResult => new Promise(leftResolve => {
        const array = arrayEmitter(rightArray);
        const filter = filterOperator(rightResult => comparer(leftResult, rightResult));
        const map = mapOperator(rightResult => [leftResult, rightResult]);
        map(filter(array))(next, leftResolve, context);
      },
      rightResolve,
      context)),
    done,
    context));
}
