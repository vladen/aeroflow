'use strict';

import { CLASS_AEROFLOW, CLASS_ARRAY, CLASS_FUNCTION, CLASS_PROMISE } from './classes';
import { SYMBOL_ITERATOR } from './symbols';
import { classOf, isObject, throwError } from './utilites';

// Returns function emitting values from multiple arbitrary sources.
function emit(...sources) {
  switch (sources.length) {
    case 0:
      return emitEmpty(); // todo: Aeroplan
    case 1:
      let source = sources[0];
      switch (classOf(source)) {
        case CLASS_AEROFLOW: return source[SYMBOL_EMITTER];
        case CLASS_ARRAY: return emitArray(source);
        case CLASS_FUNCTION: return emitFunction(source);
        case CLASS_PROMISE: return emitPromise(source);
        default:
          return Object.isObject(source) && Symbol.iterator in source
            ? emitIterable(source)
            : emitJust(source);
      }
      break;
    default:
      return (next, done, context) => {
        let limit = sources.length, index = -1, proceed = () => {
          ++index < limit
            ? emit(sources[index])(next, proceed, context)
            : done();
        };
        proceed();
      };
  }
}

// Returns emitter function emitting values from an array.
function emitArray(source) { 
  return (next, done, context) => {
    let index = -1;
    while (context() && ++index < source.length)
      next(source[index]);
    done();
  }
}

// Returns function emitting done event only.
function emitEmpty() {
  return (next, done) => {
    done();
    return true; // TODO: check this is used
  };
}

// Returns function emitting value returned from source function.
function emitFunction(source) {
  return (next, done, context) => emit(source(context.data))(next, done, context);
}

function emitIterable(source) {
  return (next, done, context) => {
    const iterator = source[SYMBOL_ITERATOR]();
    let iteration;
    while (context() && !(iteration = iterator.next()).done)
      next(iteration.value);
    done();
  };
}

// Returns function emitting single value.
function emitJust(value) {
  return (next, done) => {
    const result = next(value);
    done();
    return result; // TODO: check this is used
  };
}

// Returns function emitting value returned by promise.
function emitPromise(source) {
  return (next, done, context) => source.then(
    value => emit(value)(next, done, context),
    error => {
      done(error);
      throwError(error);
    });
}

export { emit, emitArray, emitEmpty, emitFunction, emitIterable, emitJust, emitPromise };