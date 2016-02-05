'use strict';

import { unsync } from '../unsync';

export function scalarEmitter(value) {
  return (next, done) => {
    if (!unsync(next(value), done, done)) done(true);
  };
}
