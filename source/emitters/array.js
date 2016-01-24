'use strict';

export function arrayEmitter(source) {
  return (next, done, context) => {
    let index = -1;
    while (context.active && ++index < source.length) next(source[index]);
    done();
  };
}
