'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { isFunction } from './utilites';

const tapEmitter = (emitter, callback) => (next, done, context) => {
  let index = 0;
  emitter(
    value => {
      callback(value, index++, context.data);
      return next(value);
    },
    done,
    context);
};

/**
  * Executes provided callback once per each value emitted by this flow,
  * returns new tapped flow or this flow if no callback provided.
  *
  * @param {function} [callback] Function to execute for each value emitted, taking three arguments:
  *   value emitted by this flow,
  *   index of the value,
  *   context object.
  *
  * @example
  * aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
  * // value: 1 index: 0
  * // value: 2 index: 1
  * // value: 3 index: 2
  */
function tap(callback) {
  return isFunction(callback)
    ? flow(tapEmitter(this[EMITTER], callback))
    : this;
}

export { tap, tapEmitter };
