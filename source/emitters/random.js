'use strict';

import { isInteger, mathFloor, mathRandom, toNumber } from '../utilites';

export function randomDecimalEmitter(minimum, maximum) {
  return (next, done) => {
    while (next(minimum + maximum * mathRandom()));
    done();
  };
}

export function randomIntegerEmitter(minimum, maximum) { 
  return (next, done) => {
    while (next(mathFloor(minimum + maximum * mathRandom())));
    done();
  };
}

export function randomEmitter(minimum, maximum) {
  maximum = toNumber(maximum, 1);
  minimum = toNumber(minimum, 0);
  maximum -= minimum;
  return isInteger(minimum) && isInteger(maximum)
    ? randomIntegerEmitter(minimum, maximum)
    : randomDecimalEmitter(minimum, maximum);
}
