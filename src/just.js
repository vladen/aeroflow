'use strict';

import { Aeroflow } from './aeroflow';
import emitJust from './emitJust';

/**
  * Returns new flow emitting the provided value only.
  * @static
  * 
  * @param {any} value The value to emit.
  *
  * @example
  * aeroflow.just('test').dump().run();
  * // next "test"
  * // done
  * aeroflow.just(() => 'test').dump().run();
  * // next "test"
  * // done
  */
function just(value) {
  return new Aeroflow(emitJust(value));
}

export { just };
