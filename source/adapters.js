'use strict';

import { ARRAY, FUNCTION, PROMISE } from './symbols';
import { objectCreate } from './utilites';
import { arrayEmitter } from './emitters/array';
import { functionEmitter } from './emitters/function';
import { promiseEmitter } from './emitters/promise';

export const adapters = objectCreate(null, {
  [ARRAY]: { configurable: true, value: arrayEmitter, writable: true },
  [FUNCTION]: { configurable: true, value: functionEmitter, writable: true },
  [PROMISE]: { configurable: true, value: promiseEmitter, writable: true }
});