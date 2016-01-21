'use strict';

import { Aeroflow } from './aeroflow';
import { reduceEmitter } from './reduce';
import { EMITTER } from './symbols';

const countEmitter = emitter => reduceEmitter(emitter, result => result + 1, 0);

/**
* Counts the number of values emitted by this flow, returns new flow emitting only this value.
*
* @example
* aeroflow(['a', 'b', 'c']).count().dump().run();
* // next 3
* // done
*/
function count() {
  return new Aeroflow(countEmitter(this[EMITTER]));
}

export { count, countEmitter };
