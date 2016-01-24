'use strict';

import { flow } from './flow';

// Returns function emitting single value.
const justEmitter = value => (next, done) => {
  next(value);
  done();
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
const just = value => flow(justEmitter(value));

export { just, justEmitter };
