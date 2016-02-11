'use strict';

export function emptyGenerator(result) {
  return (next, done) => done(result);
}
