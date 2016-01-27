'use strict';

export function repeatDynamicEmitter(repeater) {
  return (next, done, context) => {
    let index = 0;
    try {
      while (next(repeater(index++, context.data)));
      done();
    }
    catch(error) {
      done(error);
    }
  };
}

export function repeatStaticEmitter(value) {
  return (next, done, context) => {
    while (next(value));
    done();
  };
}

export function repeatEmitter(value) {
  return isFunction(value)
    ? repeatDynamicEmitter(value)
    : repeatStaticEmitter(value);
}
