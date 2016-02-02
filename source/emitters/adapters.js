'use strict';

import { ARRAY, BOOLEAN, DATE, FUNCTION, NUMBER, PROMISE, REGEXP } from '../symbols';
import { objectCreate } from '../utilites';
import { arrayEmitter } from './array';
import { functionEmitter } from './function';
import { promiseEmitter } from './promise';
import { scalarEmitter } from './scalar';

export const adapters = objectCreate(null, {
  [ARRAY]: { value: arrayEmitter, writable: true },
  [BOOLEAN]: { value: scalarEmitter, writable: true },
  [DATE]: { value: scalarEmitter, writable: true },
  [FUNCTION]: { value: functionEmitter, writable: true },
  [NUMBER]: { value: scalarEmitter, writable: true },
  [PROMISE]: { value: promiseEmitter, writable: true },
  [REGEXP]: { value: scalarEmitter, writable: true }
});
