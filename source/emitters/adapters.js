'use strict';

import {
  AEROFLOW, ARRAY, BOOLEAN, DATE, FUNCTION, NUMBER, PROMISE, REGEXP, STRING
} from '../symbols';
import { objectCreate } from '../utilites';
import { aeroflowEmitter } from './aeroflow';
import { arrayEmitter } from './array';
import { functionEmitter } from './function';
import { promiseEmitter } from './promise';

export const adapters = objectCreate(null, {
  [AEROFLOW]: { value: aeroflowEmitter },
  [ARRAY]: { value: arrayEmitter, writable: true },
  [FUNCTION]: { value: functionEmitter, writable: true },
  [PROMISE]: { value: promiseEmitter, writable: true }
});
