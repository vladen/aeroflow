'use strict';

import { CLASS_AEROFLOW, CLASS_ARRAY, CLASS_FUNCTION, CLASS_PROMISE } from './classes';
import { emptyEmitter } from './empty';
import { justEmitter } from './just';
import { SYMBOL_EMITTER, SYMBOL_ITERATOR } from './symbols';
import { classOf, isObject, throwError } from './utilites';

// Returns emitter function emitting values from an array.
const arrayEmitter = source => (next, done, context) => {
  let index = -1;
  while (context() && ++index < source.length)
    next(source[index]);
  done();
}

// Returns function emitting value returned from source function.
const functionEmitter = source => (next, done, context) => emit(source(context.data))(next, done, context);

const iterableEmitter = (source) => (next, done, context) => {
  const iterator = source[SYMBOL_ITERATOR]();
  let iteration;
  while (context() && !(iteration = iterator.next()).done)
    next(iteration.value);
  done();
};

// Returns function emitting value returned by promise.
const promiseEmitter = (source) => (next, done, context) => source.then(
  value => emit(value)(next, done, context),
  error => {
    done(error);
    throwError(error);
  });

// Returns function emitting values from multiple arbitrary sources.
function emit(...sources) {
  switch (sources.length) {
    case 0:
      return emptyEmitter(); // todo: Aeroplan
    case 1:
      let source = sources[0];
      switch (classOf(source)) {
        case CLASS_AEROFLOW:
          return source[SYMBOL_EMITTER];
        case CLASS_ARRAY:
          return arrayEmitter(source);
        case CLASS_FUNCTION:
          return functionEmitter(source);
        case CLASS_PROMISE:
          return promiseEmitter(source);
        default:
          return isObject(source) && SYMBOL_ITERATOR in source
            ? iterableEmitter(source)
            : justEmitter(source);
      }
      break;
    default:
      return (next, done, context) => {
        let index = -1;
        const limit = sources.length, proceed = () => {
          ++index < limit
            ? emit(sources[index])(next, proceed, context)
            : done();
        };
        proceed();
      };
  }
}

export { arrayEmitter, emit, functionEmitter, iterableEmitter, promiseEmitter };