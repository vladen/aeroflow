import { AEROFLOW, ARRAY, ERROR, FUNCTION, PROMISE } from '../symbols';
import { objectDefineProperties } from '../utilites';
import { arrayAdapter } from './array';
import { errorAdapter } from './error';
import { flowAdapter } from './flow';
import { functionAdapter } from './function';
import { iterableAdapter } from './iterable';
import { promiseAdapter } from './promise';

export const adapters = [iterableAdapter];

objectDefineProperties(adapters, {
  [AEROFLOW]: { value: flowAdapter },
  [ARRAY]: { configurable: true, value: arrayAdapter, writable: true },
  [ERROR]: { configurable: true, value: errorAdapter, writable: true },
  [FUNCTION]: { configurable: true, value: functionAdapter, writable: true },
  [PROMISE]: { configurable: true, value: promiseAdapter, writable: true }
});
