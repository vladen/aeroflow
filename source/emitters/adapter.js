'use strict';

import { AEROFLOW, ITERATOR } from '../symbols';
import { classOf, isFunction, primitives } from '../utilites';
import { aeroflowEmitter } from './aeroflow';
import { iterableEmitter } from './iterable';
import { scalarEmitter } from './scalar';
import { adapters } from './adapters';

export function adapterEmitter(source, scalar) {
  const cls = classOf(source);
  if (cls === AEROFLOW) return aeroflowEmitter(source);
  const adapter = adapters[cls];
  if (isFunction(adapter)) return adapter(source);
  if (!primitives.has(cls) && ITERATOR in source) return iterableEmitter(source);
  if (scalar) return scalarEmitter(source);
}
