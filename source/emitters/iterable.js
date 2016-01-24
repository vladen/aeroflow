'use strict';

import { ITERATOR } from '../symbols';

export function iterableEmitter(source) {
  return (next, done, context) => {
    const iterator = source[ITERATOR]();
    let iteration;
    while (context.active && !(iteration = iterator.next()).done) next(iteration.value);
    done();
  };
}
