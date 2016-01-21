'use strict';

import { Aeroflow } from './aeroflow';
import { EMITTER } from './symbols';
import { isFunction, isNothing } from './utilites';

const dumpToConsoleEmitter = (emitter, prefix) => (next, done, context) => emitter(
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

const dumpToLoggerEmitter = (emitter, prefix, logger) => (next, done, context) => emitter(
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

/**
  * Dumps all events emitted by this flow to the `logger` with optional prefix.
  *
  * @param {string} [prefix=''] A string prefix prepended to each event name.
  * @param {function} [logger=console.log] Function to execute for each event emitted, taking two arguments:
  *   event - The name of event emitted prepended with prefix (next or done).
  *   value - The value (next event) or error (done event) emitted by this flow.
  *
  * @example
  * aeroflow(1, 2, 3).dump('test ', console.info.bind(console)).run();
  * // test next 1
  * // test next 2
  * // test next 3
  * // test done
  */
function dump(prefix, logger) {
  return new Aeroflow(arguments.length === 0
    ? dumpToConsoleEmitter(
        this[EMITTER],
        '')
    : arguments.length === 1
      ? isFunction(prefix)
        ? dumpToLoggerEmitter(
            this[EMITTER],
            '',
            prefix)
        : dumpToConsoleEmitter(
            this[EMITTER],
            '')
      : isFunction(logger)
        ? isNothing(prefix)
          ? dumpToLoggerEmitter(
              this[EMITTER],
              '',
              logger)
          : dumpToLoggerEmitter(
              this[EMITTER],
              prefix,
              logger)
        : dumpToConsoleEmitter(
            this[EMITTER],
            prefix));
}

export { dump, dumpToConsoleEmitter, dumpToLoggerEmitter };
