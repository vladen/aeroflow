'use strict';

import { AEROFLOW, BOOLEAN, ITERATOR, NULL, NUMBER, SYMBOL, UNDEFINED } from '../symbols';
import { classOf, isFunction } from '../utilites';
import { iterableEmitter } from './iterable';
import { scalarEmitter } from './scalar';
import { adapters } from './adapters';

const primitives = new Set([BOOLEAN, NULL, NUMBER, SYMBOL, UNDEFINED]);

export function emitterSelector(source, scalar) {
  const cls = classOf(source);
  if (cls === AEROFLOW) return source.emitter;
  const adapter = adapters[cls];
  if (isFunction(adapter)) return adapter(source);
  if (!primitives.has(cls) && ITERATOR in source) return iterableEmitter(source);
  if (scalar) return scalarEmitter(source);
}
