'use strict';

import { isError, isFunction, isUndefined, tie } from '../utilites';
import { unsync } from '../unsync';
import { scalarAdapter } from '../adapters/scalar';
import { emptyEmitter } from '../emitters/empty';

function reduceAlongOperator(reducer) {
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

function reduceGeneralOperator(reducer, seed) {
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

function reduceOptionalOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let empty = true, index = 0, reduced = seed;
    emitter(
      result => {
        empty = false;
        reduced = reducer(reduced, result, index++, context.data);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(reduced), tie(done, result), done))
          done(result);
      },
      context);
  };
}

export function reduceOperator(reducer, seed, optional) {
  return isUndefined(reducer)
    ? () => emptyEmitter(false)
    : isFunction(reducer)
      ? isUndefined(seed)
        ? reduceAlongOperator(reducer)
        : optional
          ? reduceOptionalOperator(reducer, seed)
          : reduceGeneralOperator(reducer, seed)
      : () => scalarAdapter(reducer);
}
