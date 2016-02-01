'use strict';

import { isFunction, isUndefined } from '../utilites';
import { emptyEmitter } from '../emitters/empty';
import { scalarEmitter } from '../emitters/scalar';

export function reduceAlongOperator(reducer) {
  return emitter => (next, done, context) => {
    let idle = true, index = 1, result;
    emitter(
      value => {
        if (idle) {
          idle = false;
          result = value;
        }
        else result = reducer(result, value, index++, context.data);
        return true;
      },
      error => {
        if (isUndefined(error) && !idle) next(result);
        return done(error);
      },
      context);
  };
}

export function reduceGeneralOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let index = 0, result = seed;
    emitter(
      value => {
        result = reducer(result, value, index++, context.data)
        return true;
      },
      error => {
        if (isUndefined(error)) next(result);
        return done(error);
      },
      context);
  };
}

export function reduceOptionalOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let idle = true, index = 0, result = seed;
    emitter(
      value => {
        idle = false;
        result = reducer(result, value, index++, context.data);
        return true;
      },
      error => {
        if (isUndefined(error) && !idle) next(result);
        return done(error);
      },
      context);
  };
}

export function reduceOperator(reducer, seed, optional) {
  return isUndefined(reducer)
    ? emptyEmitter
    : !isFunction(reducer)
      ? () => scalarEmitter(reducer)
      : isUndefined(seed)
        ? reduceAlongOperator(reducer)
        : optional
          ? reduceOptionalOperator(reducer, seed)
          : reduceGeneralOperator(reducer, seed);
}
