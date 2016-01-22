'use strict';

import { flow } from './flow';
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
    ? flow((next, done, context) => {
        context.track(emitter(
          value => {
            if (context.active) next();
          },
          error => {
            if (!context.active) return;
            done();
            context.done();
          },
          context));
      })
    : just(emitter)
  : empty;

export { create };