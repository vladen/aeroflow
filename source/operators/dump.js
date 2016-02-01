'use strict';

import { isFunction, isUndefined } from '../utilites';

export function dumpToConsoleOperator(prefix) {
  return emitter => (next, done, context) => emitter(
    value => {
      console.log(prefix + 'next', value);
      return next(value);
    },
    error => {
      error
        ? console.error(prefix + 'done', error)
        : console.log(prefix + 'done');
      return done(error);
    },
    context);
}

export function dumpToLoggerOperator(prefix, logger) {
  return emitter => (next, done, context) => emitter(
    value => {
      logger(prefix + 'next', value);
      return next(value);
    },
    error => {
      error
        ? logger(prefix + 'done', error)
        : logger(prefix + 'done');
      return done(error);
    },
    context);
}

export function dumpOperator(prefix, logger) {
  return isFunction(prefix)
    ? dumpToLoggerOperator('', prefix)
    : isFunction(logger)
      ? dumpToLoggerOperator(prefix, logger)
      : isUndefined(prefix)
        ? dumpToConsoleOperator('')
        : dumpToConsoleOperator(prefix);
}
