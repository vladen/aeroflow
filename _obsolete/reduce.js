'use strict';

import { empty } from './aeroflow';
import { just } from './just';
import { EMITTER } from './symbols';
import { isFunction } from './utilites';

const reduceEmitter = (emitter, reducer, seed) => (next, done, context) => {
  let index = 0, result = seed;
  emitter(
    value => result = reducer(result, value, index++, context.data),
    error => {
      next(result);
      done(error);
    },
    context);
};

const reduceAlongEmitter = (emitter, reducer) => (next, done, context) => {
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

const reduceOptionalEmitter = (emitter, reducer, seed) => (next, done, context) => {
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

/**
* Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
* returns new flow emitting reduced value.
*
* @param {function|any} reducer Function to execute on each emitted value, taking four arguments:
*   result - the value previously returned in the last invocation of the reducer, or seed, if supplied
*   value - the current value emitted by this flow
*   index - the index of the current value emitted by the flow
*   context.data.
*   If is not a function, a flow emitting just reducer value will be returned.
* @param {any} initial Value to use as the first argument to the first call of the reducer.
*
* @example
* aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
* aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
*/
function reduce(reducer, seed) {
  switch (arguments.length) {
    case 0:
      return empty;
    case 1:
      return isFunction(reducer)
        ? flow(reduceAlongEmitter(this[EMITTER], reducer))
        : just(reducer)
    default:
      return isFunction(reducer)
        ? flow(reduceEmitter(this[EMITTER], reducer, seed))
        : just(reducer)
  }
}

export { reduce, reduceEmitter, reduceAlongEmitter, reduceOptionalEmitter };
