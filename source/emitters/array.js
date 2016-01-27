'use strict';

export function arrayEmitter(source) {
  return (next, done, context) => {
    let index = -1;
    while (++index < source.length && next(source[index]));
    done();
  };
}
