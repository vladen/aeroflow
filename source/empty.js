'use strict';

import { flow } from './flow';

function emptyEmitter() {
  return (next, done) => done();
}
const empty = flow(emptyEmitter());

export { empty, emptyEmitter };
