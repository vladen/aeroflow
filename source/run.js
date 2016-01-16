'use strict';

import { createContext } from './context';
import { SYMBOL_EMITTER } from './symbols';
import { isFunction, noop } from './utilites';

/**
 * Runs this flow asynchronously, initiating source to emit values,
 * applying declared operators to emitted values and invoking provided callbacks.
 * If no callbacks provided, runs this flow for its side-effects only.
 *
 * @param {function} [next] Callback to execute for each emitted value, taking two arguments: value, context.
 * @param {function} [done] Callback to execute as emission is complete, taking two arguments: error, context.
 * @param {function} [data] Arbitrary value passed to each callback invoked by this flow as context.data.
 *
 * @example
 * aeroflow.range(1, 3).run(
 *   value => console.log('next', value),
 *   error => console.log('done', error));
 * // next 1
 * // next 2
 * // next 3
 * // done undefined
 */
function run(next, done, data) {
  if (!isFunction(done)) 
    done = noop;
  if (!isFunction(next)) 
    next = noop;
  let context = createContext(this, data), emitter = this[SYMBOL_EMITTER];
  setImmediate(() => {
    let index = 0;
    emitter(
      value => next(value, index++, context),
      error => {
        context.end();
        done(error, index, context);
      },
      context);
  });
  return this;
}

export { run };
