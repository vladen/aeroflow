'use strict';

import { isFunction, isNothing } from '../utilites';

export function dumpToConsoleOperator(prefix) {
  return emitter => (next, done, context) => emitter(
    value => {
      console.log(prefix + 'next', value);
      next(value);
    },
    error => {
      error
        ? console.error(prefix + 'done', error)
        : console.log(prefix + 'done');
      done(error);
    },
    context);
}

export function dumpToLoggerOperator(prefix, logger) {
  return emitter => (next, done, context) => emitter(
    value => {
      logger(prefix + 'next', value);
      next(value);
    },
    error => {
      error
        ? logger(prefix + 'done', error)
        : logger(prefix + 'done');
      done(error);
    },
    context);
}

export function dumpOperator(prefix, logger) {
  return arguments.length === 0
    ? dumpToConsoleEmitter('')
    : arguments.length === 1
      ? isFunction(prefix)
        ? dumpToLoggerEmitter('', prefix)
        : dumpToConsoleEmitter('')
      : isFunction(logger)
        ? isNothing(prefix)
          ? dumpToLoggerEmitter('', logger)
          : dumpToLoggerEmitter(prefix, logger)
        : dumpToConsoleEmitter(prefix);
}
