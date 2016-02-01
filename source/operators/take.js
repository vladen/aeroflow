'use strict';

import { FUNCTION, NUMBER } from '../symbols';
import { classOf, identity, mathMax } from '../utilites';
import { emptyEmitter } from '../emitters/empty';
import { toArrayOperator } from './toArray';

export function takeFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = -1;
    emitter(
      value => ++index < count && next(value),
      done,
      context);
  };
}

export function takeLastOperator(count) {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    values => {
      const limit = values.length;
      let index = mathMax(limit - count - 1, 0);
      while (++index < limit && next(values[index]));
      done();
    }, 
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
    case NUMBER: return condition > 0
      ? takeFirstOperator(condition)
      : condition < 0
        ? takeLastOperator(-condition)
        : emptyEmitter();
    case FUNCTION: return takeWhileOperator(condition);
    default: return condition
      ? identity
      : emptyEmitter();
  }
}
