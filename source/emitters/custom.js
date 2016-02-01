'use strict';

import { isFunction, isUndefined } from '../utilites';
import { emptyEmitter } from './empty';
import { scalarEmitter } from './scalar';

function finalize(finalizer) {
  if (isFunction(finalizer)) finalizer();
}

export function customEmitter(emitter) {
  if (isUndefined(emitter)) return emptyEmitter();
  if (!isFunction(emitter)) return scalarEmitter(emitter);
  return (next, done, context) => {
    let complete = false, finalizer;
    try {
      finalizer = emitter(
        value => {
          if (complete) return false;
          if (next(value)) return true;
          complete = true;
          done();
        },
        error => {
          if (complete) return;
          complete = true;
          done(error);
        },
        context);
    }
    catch(error) {
      if (complete) {
        finalize(finalizer);
        throw error;
      }
      complete = true;
      done();
    }
    finalize(finalizer);
  };
}
