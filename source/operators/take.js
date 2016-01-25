'use strict';

import { FUNCTION, NUMBER } from '../symbols';
import { classOf, identity, mathMax } from '../utilites';
import { emptyEmitter } from '../emitters/empty';
import { toArrayOperator } from './toArray';

export function takeFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = 1;
    context = context.spawn();
    emitter(
      value => {
        next(value);
        if (count <= index++) context.done();
      },
      done,
      context);
  };
}

export function takeLastOperator(count) {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    value => {
      const limit = value.length;
      let index = mathMax(limit - 1 - count, 0);
      while (index < limit) next(value[index++]);
    },
    done,
    context);
}

export function takeWhileOperator(predicate) {
  return emitter => (next, done, context) => {
    let index = 0;
    context = context.spawn();
    emitter(
      value => {
        if (predicate(value, index++, context.data)) next(value);
        else context.done();
      },
      done,
      context);
  };
}

export function takeOperator(condition) {
  switch (classOf(condition)) {
    case NUMBER: return condition > 0
      ? takeFirstOperator(condition)
      : condition < 0
        ? takeLastOperator(condition)
        : emptyEmitter();
    case FUNCTION: return takeWhileOperator(condition);
    default: return condition
      ? identity
      : emptyEmitter();
  }
}
