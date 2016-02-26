'use strict';

import { isFunction, noop, toFunction } from '../utilites';

export function customNotifier(next, done) {
  if (isFunction(next)) return {
    done: toFunction(done, noop),
    next
  };
}
