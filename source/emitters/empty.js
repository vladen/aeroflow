'use strict';

export function emptyEmitter() {
  return (next, done) => done();
}
