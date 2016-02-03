'use strict';

import { identity, isInteger, mathFloor, mathPow, mathRandom, toNumber } from '../utilites';
import { unsync } from '../unsync';

export function randomEmitter(minimum, maximum) {
  maximum = toNumber(maximum, 1 - mathPow(10,-15));
  minimum = toNumber(minimum, 0);
  maximum -= minimum;
  const rounder = isInteger(minimum) && isInteger(maximum)
    ? mathFloor
    : identity;
  return (next, done) => {
    !function proceed() {
      while (!unsync(next(rounder(minimum + maximum * mathRandom())), proceed, done));
    }();
  };
}
