'use strict';

import { unsync } from '../unsync';

export function promiseEmitter(source) {
  return (next, done, context) => source.then(
    value => {
      if (!unsync(next(value), done, done))
        done(true);
    },
    done);
}
