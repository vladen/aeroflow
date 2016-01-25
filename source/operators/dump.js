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
  return isFunction(prefix)
    ? dumpToLoggerOperator('', prefix)
    : isFunction(logger)
      ? dumpToLoggerOperator(prefix, logger)
      : isNothing(prefix)
        ? dumpToConsoleOperator('')
        : dumpToConsoleOperator(prefix);
}
