'use strict';

import { Aeroflow } from './aeroflow';
import { SYMBOL_EMITTER } from './symbols';
import { toArrayEmitter } from './toArray';
import { mathFloor } from './utilites';

const meanEmitter = emitter => (next, done, context) => toArrayEmitter(emitter)(
  values => {
    if (!values.length) return;
    values.sort();
    next(values[mathFloor(values.length / 2)]);
  },
  done,
  context);

/**
  * Determines the mean value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
  * // next 3
  * // done
  */
function mean() {
  return new Aeroflow(meanEmitter(this[SYMBOL_EMITTER]));
}

export { mean, meanEmitter };
