'use strict';

import { isFunction } from '../utilites';
import { emptyEmitter } from '../emitters/empty';
import { valueEmitter } from '../emitters/value';

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
      },
      error => {
        if (!idle) next(result);
        done(error);
      },
      context);
  };
}

export function reduceGeneralOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let index = 0, result = seed;
    emitter(
      value => result = reducer(result, value, index++, context.data),
      error => {
        next(result);
        done(error);
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
      },
      error => {
        if (!idle) next(result);
        done(error);
      },
      context);
  };
}

export function reduceOperator(reducer, seed, optional) {
  const arity = arguments.length;
  if (!arity || !isFunction(reducer)) return () => emptyEmitter();
  switch (arity) {
    case 1: return reduceAlongOperator(reducer);
    case 2: return reduceGeneralOperator(reducer, seed);
    default:
      return isFunction(reducer)
        ? optional
          ? reduceOptionalOperator(reducer, seed)
          : reduceGeneralOperator(reducer, seed)
        : () => valueEmitter(reducer)
  }
}
