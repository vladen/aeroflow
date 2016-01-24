'use strict';

import { flow } from './flow';
import { reduceAlongEmitter } from './reduce';
import { EMITTER } from './symbols';

const maxEmitter = emitter => reduceAlongEmitter(
  emitter,
  (maximum, value) => value > maximum ? value : maximum);

/**
  * Determines the maximum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 2, 3]).max().dump().run();
  * // next 3
  * // done
  */
function max() {
  return flow(maxEmitter(this[EMITTER]));
}

export { max, maxEmitter };
