'use strict';

import { isFunction } from '../utilites';
import { emptyEmitter } from './empty';
import { valueEmitter } from './value';

export function customEmitter(emitter) {
  return arguments.length
    ? isFunction(emitter)
      ? (next, done, context) => context.track(emitter(
          value => {
            if (context.active) next();
          },
          error => {
            if (!context.active) return;
            done();
            context.done();
          },
          context))
      : valueEmitter(emitter)
    : emptyEmitter();
}
