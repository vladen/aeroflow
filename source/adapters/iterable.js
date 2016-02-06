'use strict';

import { ITERATOR } from '../symbols';
import { unsync } from '../unsync';

export function iterableAdapter(source) {
  return (next, done, context) => {
    let iteration, iterator = iterator = source[ITERATOR]();
    !function proceed() {
      while (!(iteration = iterator.next()).done)
        if (unsync(next(iteration.value), proceed, done))
          return;
      done(true);
    }();
  };
}
