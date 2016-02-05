'use strict';

export function emptyEmitter(result) {
  return (next, done) => done(result);
}
