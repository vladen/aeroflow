'use strict';

import { Aeroflow } from './aeroflow';
import { empty } from './empty';
import { just } from './just';
import { isFunction } from './utilites';

/**
  * Creates programmatically controlled flow.
  * @static
  *
  * @param {function|any} emitter The emitter function taking three arguments:
  *   next - the function emitting 'next' event,
  *   done - the function emitting 'done' event,
  *   context - current execution context.
  *
  * @example
  * aeroflow.create((next, done, context) => {
  *   next(1);
  *   next(new Promise(resolve => setTimeout(() => resolve(2), 500)));
  *   setTimeout(done, 1000);
  * }).dump().run();
  * // next 1 // after 500ms
  * // next 2 // after 1000ms
  * // done
  */
const create = emitter => arguments.length
  ? isFunction(emitter)
    ? new Aeroflow((next, done, context) => {
        let completed = false;
        context.onend(emitter(
          value => context() ? next() : false,
          error => {
            if (completed) return;
            completed = true;
            done();
            context.end();
          },
          context));
      })
    : just(emitter)
  : empty;

export { create };