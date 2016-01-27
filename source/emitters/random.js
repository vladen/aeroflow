'use strict';

import { isInteger, mathFloor, mathRandom, toNumber } from '../utilites';

export function randomDecimalEmitter(min, max) {
  return (next, done) => {
    while (next(min + max * mathRandom()));
    done();
  };
}

export function randomIntegerEmitter(min, max) { 
  return (next, done) => {
    while (next(mathFloor(min + max * mathRandom())));
    done();
  };
}

export function randomEmitter(min, max) {
  max = toNumber(max, 1);
  min = toNumber(min, 0);
  max -= min;
  return isInteger(min) && isInteger(max)
    ? randomIntegerEmitter(min, max)
    : randomDecimalEmitter(min, max);
}
