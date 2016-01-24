'use strict';

export function repeatDynamicEmitter(repeater) {
  return (next, done, context) => {
    let index = 0, result;
    while (context.active && false !== (result = repeater(index++, context.data))) next(result);
    done();
  };
}

export function repeatStaticEmitter(value) {
  return (next, done, context) => {
    while(context.active) next(value);
    done();
  };
}

export function repeatEmitter(value) {
  return isFunction(value)
    ? repeatDynamicEmitter(value)
    : repeatStaticEmitter(value);
}
