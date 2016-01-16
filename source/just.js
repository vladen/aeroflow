'use strict';

import { Aeroflow } from './aeroflow';

// Returns function emitting single value.
const justEmitter = value => (next, done) => {
  const result = next(value);
  done();
  return result; // TODO: check this is used
};

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
const just = value => new Aeroflow(justEmitter(value));

export { just, justEmitter };
