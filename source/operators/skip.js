'use strict';

import { FUNCTION, NUMBER, UNDEFINED } from '../symbols';
import { classOf, identity, mathMax, noop } from '../utilites';
import { toArrayOperator } from './toArray';

export function skipAllOperator() {
  return emitter => (next, done, context) => emitter(noop, done, context);
}

export function skipFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = -1;
    emitter(
      result => ++index < count || next(result),
      done,
      context);
  };
}

export function skipLastOperator(count) {
  return emitter => (next, done, context) => {
    let array;
    toArrayOperator()(emitter)(
      result => {
        array = result;
        return false;
      },
      result => {
        if (isError(result)) done(result);
        else arrayEmitter(array.slice(mathMax(values.length - count, 0)))(next, done, context);
      },
      context);
  }
}

export function skipWhileOperator(predicate) {
  return emitter => (next, done, context) => {
    let index = 0, skipping = true;
    emitter(
      value => {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        return skipping || next(value);
      },
      done,
      context);
  };
}

export function skipOperator(condition) {
  switch (classOf(condition)) {
    case NUMBER:
      return condition > 0
        ? skipFirstOperator(condition)
        : condition < 0
          ? skipLastOperator(-condition)
          : identity;
    case FUNCTION:
      return skipWhileOperator(condition);
    case UNDEFINED:
      return skipAllOperator();
    default:
      return condition
        ? skipAllOperator()
        : identity;
  }
}
