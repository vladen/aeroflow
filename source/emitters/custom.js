'use strict';

import { isFunction } from '../utilites';
import { emptyEmitter } from './empty';
import { valueEmitter } from './value';

function finalize(finalizer) {
  if (isFunction(finalizer)) finalizer();
}

export function customEmitter(emitter) {
  return arguments.length
    ? isFunction(emitter)
      ? (next, done, context) => {
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
        }
      : valueEmitter(emitter)
    : emptyEmitter();
}
