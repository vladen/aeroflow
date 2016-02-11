'use strict';

import { isFunction, isUndefined } from '../utilites';
import { unsync } from '../unsync';
import { scalarAdapter } from '../adapters/scalar';
import { emptyGenerator } from './empty';

export function customGenerator(generator) {
  if (isUndefined(generator)) return emptyGenerator(true);
  if (!isFunction(generator)) return scalarAdapter(generator);
  return (next, done, context) => {
    let buffer = [], busy = false, idle = false, finalizer;
    finalizer = generator(
      result => {
        if (idle) return false;
        buffer.push(result);
        if (!busy) proceed(true);
        return true;
      },
      result => {
        if (idle) return false;
        idle = true;
        buffer.result = isUndefined(result) || result;
        if (!busy) proceed(true);
        return true;
      },
      context.data);
    function complete(result) {
      idle = true;
      if (isFunction(finalizer)) setTimeout(finalizer, 0);
      done(result && buffer.result);
    }
    function proceed(result) {
      busy = false;
      if (result) while (buffer.length) if (unsync(next(buffer.shift()), proceed, complete)) {
        busy = true;
        return;
      }
      complete(result);
    }
  };
}
