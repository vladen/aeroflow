'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { constant, isFunction } from './utilites';

const mapEmitter = (emitter, mapper) => (next, done, context) => {
  let index = 0;
  emitter(
    value => next(mapper(value, index++, context.data)),
    done,
    context);
}

function map(mapper) {
  return arguments.length
    ? flow(mapEmitter(
        this[EMITTER],
        isFunction(mapper)
          ? mapper
          : constant(mapper)))
    : this;
}

export { map, mapEmitter };
