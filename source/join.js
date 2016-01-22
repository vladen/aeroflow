'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { reduceOptionalEmitter } from './reduce';
import { isFunction } from './utilites';

const joinEmitter = (emitter, joiner) => reduceOptionalEmitter(
  emitter,
  (result, value, index, data) => result.length
    ? result + joiner(value, index, data) + value 
    : value,
  '');

function join(separator) {
  return flow(joinEmitter(
    this[EMITTER],
    arguments.length
    ? isFunction(separator)
      ? separator
      : () => '' + separator
    : () => ','));
}

export { join };
