'use strict';

import { isFunction, isNumber, noop } from '../utilites';
import { toArrayOperator } from './toArray';

export function skipAllOperator() {
  return emitter => (next, done, context) => emitter(noop, done, context);
}

export function skipFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = -1;
    emitter(
      value => {
        if (++index >= count) next(value);
      },
      done,
      context);
  };
}

export function skipLastOperator(count) {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    value => {
      for (let index = -1, limit = value.length - count; ++index < limit;) next(value[index]);
    },
    done,
    context);
}

export function skipWhileOperator(predicate) {
  return emitter => (next, done, context) => {
    let index = 0, skipping = true;
    emitter(
      value => {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      },
      done,
      context);
  };
}

export function skipOperator(condition) {
  return isNumber(condition)
    ? condition > 0
      ? skipFirstOperator(condition)
      : condition < 0
        ? skipLastOperator(-condition)
        : identity
    : isFunction(condition)
      ? skipWhileOperator(condition)
      : condition
        ? skipAllOperator()
        : identity;
}
