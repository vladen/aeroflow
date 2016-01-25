'use strict';

import { flow } from './flow';
import { EMITTER } from './symbols';
import { reduceEmitter } from './reduce';

const sumEmitter = emitter => reduceEmitter(
  emitter,
  (result, value) => result + value, 0);

/*
  aeroflow([1, 2, 3]).sum().dump().run();
*/
function sum() {
  return flow(sumEmitter(this[EMITTER]));
}

export { sum, sumEmitter };
