'use strict';

import { Aeroflow } from './aeroflow';
import { SYMBOL_EMITTER } from './symbols';
import { reduceEmitter } from './reduce';

const sumEmitter = emitter => reduceEmitter(emitter, (result, value) => result + value, 0);

/*
  aeroflow([1, 2, 3]).sum().dump().run();
*/
function sum() {
  return new Aeroflow(sumEmitter(this[SYMBOL_EMITTER]));
}

export { sum, sumEmitter };
