'use strict';

import {
  AEROFLOW, ARRAY, BOOLEAN, DATE, FUNCTION, NUMBER, PROMISE, PROTOTYPE, REGEXP, STRING
} from '../symbols';
import { objectCreate } from '../utilites';
import { aeroflowEmitter } from './aeroflow';
import { arrayEmitter } from './array';
import { functionEmitter } from './function';
import { promiseEmitter } from './promise';

export const adapters = objectCreate(Object[PROTOTYPE], {
  [AEROFLOW]: { value: aeroflowEmitter },
  [ARRAY]: { configurable: true, value: arrayEmitter, writable: true },
  [FUNCTION]: { configurable: true, value: functionEmitter, writable: true },
  [PROMISE]: { configurable: true, value: promiseEmitter, writable: true }
});
