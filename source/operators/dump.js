import { isError, isFunction, isUndefined } from '../utilites';

export function dumpToConsoleOperator(prefix) {
  return emitter => (next, done, context) => emitter(
    result => {
      console.log(prefix + 'next', result);
      return next(result);
    },
    result => {
      console[isError(result) ? 'error' : 'log'](prefix + 'done', result);
      done(result);
    },
    context);
}

// TODO: turn into console notifier
export function dumpToLoggerOperator(prefix, logger) {
  return emitter => (next, done, context) => emitter(
    result => {
      logger(prefix + 'next', result);
      return next(result);
    },
    result => {
      logger(prefix + 'done', result);
      done(result);
    },
    context);
}

export default function dumpOperator(prefix, logger) {
  return isFunction(prefix)
    ? dumpToLoggerOperator('', prefix)
    : isFunction(logger)
      ? dumpToLoggerOperator(prefix, logger)
      : isUndefined(prefix)
        ? dumpToConsoleOperator('')
        : dumpToConsoleOperator(prefix);
}
