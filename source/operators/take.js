'use strict';

import { FUNCTION, NUMBER } from '../symbols';
import { classOf, falsey, identity, isBoolean, isPromise, mathMax } from '../utilites';
import { arrayEmitter } from '../emitters/array';
import { emptyEmitter } from '../emitters/empty';
import { toArrayOperator } from './toArray';

export function takeFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      result => {
        if (++index < count) return next(result);
        result = next(result);
        if (isBoolean(result)) return false;
        if (isPromise(result)) return result.then(falsey);
        return result;
      },
      done,
      context);
  };
}

export function takeLastOperator(count) {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    result => new Promise(resolve =>
      arrayEmitter(result.slice(mathMax(result.length - count, 0)))(next, resolve, context)),
    done, 
    context);
}

export function takeWhileOperator(predicate) {
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => predicate(value, index++, context.data) && next(value),
      done,
      context);
  };
}

export function takeOperator(condition) {
  switch (classOf(condition)) {
    case NUMBER:
      return condition > 0
        ? takeFirstOperator(condition)
        : condition < 0
          ? takeLastOperator(-condition)
          : emptyEmitter();
    case FUNCTION:
      return takeWhileOperator(condition);
    default:
      return condition
        ? identity
        : emptyEmitter();
  }
}
