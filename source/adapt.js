'use strict';

import {
  AEROFLOW, ARRAY, BOOLEAN, FUNCTION, ITERATOR, NULL, NUMBER, PROMISE, PROTOTYPE, SYMBOL, UNDEFINED
} from './symbols';
import { classOf, isFunction, objectCreate } from './utilites';
import { flowAdapter } from './adapters/flow';
import { arrayAdapter } from './adapters/array';
import { functionAdapter } from './adapters/function';
import { iterableAdapter } from './adapters/iterable';
import { promiseAdapter } from './adapters/promise';
import { scalarAdapter } from './adapters/scalar';

export const adapters = objectCreate(Object[PROTOTYPE], {
  [AEROFLOW]: { value: flowAdapter },
  [ARRAY]: { configurable: true, value: arrayAdapter, writable: true },
  [FUNCTION]: { configurable: true, value: functionAdapter, writable: true },
  [PROMISE]: { configurable: true, value: promiseAdapter, writable: true }
});

export function adapt(source, scalar) {
  const sourceClass = classOf(source);
  switch (sourceClass) {
    case BOOLEAN:
    case NULL:
    case NUMBER:
    case SYMBOL:
    case UNDEFINED:
      break;
    default:
      const adapter = adapters[sourceClass];
      if (isFunction(adapter)) return adapter(source);
      if (ITERATOR in source) return iterableAdapter(source);
      break;
  }
  if (scalar) return scalarAdapter(source);
}
