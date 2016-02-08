'use strict';

import { AEROFLOW, ARRAY, ERROR, FUNCTION, PROMISE } from '../symbols';
import { classOf, isFunction, objectDefineProperties } from '../utilites';
import { arrayAdapter } from './array';
import { errorAdapter } from './error';
import { flowAdapter } from './flow';
import { functionAdapter } from './function';
import { iterableAdapter } from './iterable';
import { promiseAdapter } from './promise';

export const adapters = objectDefineProperties([iterableAdapter], {
  [AEROFLOW]: { value: flowAdapter },
  [ARRAY]: { configurable: true, value: arrayAdapter, writable: true },
  [ERROR]: { configurable: true, value: errorAdapter, writable: true },
  [FUNCTION]: { configurable: true, value: functionAdapter, writable: true },
  [PROMISE]: { configurable: true, value: promiseAdapter, writable: true }
});

export function adapterSelector(source, def) {
  const sourceClass = classOf(source);
  let adapter = adapters[sourceClass];
  if (isFunction(adapter)) return adapter(source);
  for (let i = -1, l = adapters.length; ++i < l;) {
    adapter = adapters[i](source, sourceClass);
    if (isFunction(adapter)) return adapter;
  }
  return def;
}
