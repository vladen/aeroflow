'use strict';

import { identity, isFunction, isNumber, mathMax } from '../utilites';
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
  return arguments.length
    ? isNumber(condition)
      ? condition === 0
        ? emptyEmitter()
        : condition > 0
          ? takeFirstOperator(condition)
          : takeLastOperator(condition)
      : isFunction(condition)
        ? takeWhileOperator(condition)
        : condition
          ? identity
          : emptyEmitter()
    : identity;
}
