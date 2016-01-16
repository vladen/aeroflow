'use strict';

import { Aeroflow } from './aeroflow';

// Returns function emitting done event only.
const emptyEmitter = () => (next, done) => {
  done();
  return true; // TODO: check this is used
};

// Empty flow.
const empty = new Aeroflow(emptyEmitter());

export { empty, emptyEmitter };
