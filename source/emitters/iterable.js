'use strict';

import { ITERATOR } from '../symbols'

export function iterableEmitter(source) {
  return (next, done, context) => {
    const iterator = source[ITERATOR]();
    let iteration;
    try {
      do iteration = iterator.next();
      while (!iteration.done && next(iteration.value));
      done();  
    }
    catch(error) {
      done(error);
    }
  };
}
