'use strict';

import { isError, isFunction, isUndefined } from '../utilites';

export function dumpToConsoleOperator(prefix) {
  return emitter => (next, done, context) => emitter(
    result => {
      console.log(prefix + 'next', result);
      return next(result);
    },
    result => {
      isError(result)
        ? console.error(prefix + 'done', result)
        : console.log(prefix + 'done');
      done(result);
    },
    context);
}

export function dumpToLoggerOperator(prefix, logger) {
  return emitter => (next, done, context) => emitter(
    result => {
      logger(prefix + 'next', result);
      return next(result);
    },
    result => {
      isError(result)
        ? logger(prefix + 'done', result)
        : logger(prefix + 'done');
      done(result);
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
