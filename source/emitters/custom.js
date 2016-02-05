'use strict';

import { isFunction, isUndefined } from '../utilites';
import { unsync } from '../unsync';
import { emptyEmitter } from './empty';
import { scalarEmitter } from './scalar';

export function customEmitter(emitter) {
  if (isUndefined(emitter)) return emptyEmitter(true);
  if (!isFunction(emitter)) return scalarEmitter(emitter);
  return (next, done, context) => {
    let buffer = [], completed = false, finalizer, waiting = false;
    finalizer = emitter(accept, finish, context);
    function accept(result) {
      buffer.push(result);
      proceed();
    }
    function finish(result) {
      if (completed) return;
      completed = true;
      if (isFunction(finalizer)) setTimeout(finalizer, 0);
      if (isUndefined(result)) result = true;
      done(result);
    }
    function proceed() {
      waiting = false;
      while (buffer.length) if (unsync(next(buffer.shift()), proceed, finish)) {
        waiting = true;
        return;
      }
    }
  };
}
