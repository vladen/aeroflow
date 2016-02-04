'use strict';

import { unsync } from '../unsync';

export function functionEmitter(source) {
  return (next, done, context) => {
    if (!unsync(next(source(context.data)), done, done)) done(true);
  };
}
