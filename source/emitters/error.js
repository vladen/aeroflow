'use strict';

import { isError } from '../utilites';

export function errorEmitter(message) {
  return (next, done) => done(isError(message)
    ? message
    : new Error(message));
}
