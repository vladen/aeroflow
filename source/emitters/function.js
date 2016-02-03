'use strict';

import { unsync } from '../unsync';

export function functionEmitter(source) {
  return (next, done, context) => {
    try {
      if (!unsync(next(source(context.data)), done, done))
        done(true);
    }
    catch(error) {
      done(error);
    }
  };
}
