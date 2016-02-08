'use strict';

import { unsync } from '../unsync';

export function arrayAdapter(source) {
  return (next, done, context) => {
    let index = -1, length = source.length;
    !function proceed() {
      while (++index < length) if (unsync(next(source[index]), proceed, done)) return;
      done(true);
    }();
  };
}
