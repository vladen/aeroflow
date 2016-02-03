'use strict';

import { isError, isFunction, isUndefined, tie } from '../utilites';
import { emptyEmitter } from '../emitters/empty';
import { scalarEmitter } from '../emitters/scalar';

export function reduceAlongOperator(reducer) {
  return emitter => (next, done, context) => {
    let empty = true, index = 1, reduced;
    emitter(
      result => {
        if (empty) {
          empty = false;
          reduced = result;
        }
        else reduced = reducer(reduced, result, index++, context.data);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(reduced), tie(done, result), done))
          done(result);
      },
      context);
  };
}

export function reduceGeneralOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let index = 0, reduced = seed;
    emitter(
      result => {
        reduced = reducer(reduced, result, index++, context.data)
        return true;
      },
      result => {
        if (isError(result) || !unsync(next(reduced), tie(done, result), done))
          done(result);
      },
      context);
  };
}

export function reduceOptionalOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let empty = true, index = 0, reduced = seed;
    emitter(
      result => {
        empty = false;
        reduced = reducer(reduced, result, index++, context.data);
        return true;
      },
      result => {
        if (isError(error) || empty || !unsync(next(reduced), tie(done, result), done))
          done(result);
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
