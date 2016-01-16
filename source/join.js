'use strict';

import { Aeroflow } from './aeroflow';
import { SYMBOL_EMITTER } from './symbols';
import { reduceOptionalEmitter } from './reduce';
import { isFunction } from './utilites';

const joinEmitter = (emitter, joiner) => reduceOptionalEmitter(
  emitter,
  (result, value, index, data) => result.length
    ? result + joiner(value, index, data) + value 
    : value,
  '');

function join(separator) {
  return new Aeroflow(joinEmitter(
    this[SYMBOL_EMITTER],
    arguments.length
    ? isFunction(separator)
      ? separator
      : () => '' + separator
    : () => ','));
}

export { join };
