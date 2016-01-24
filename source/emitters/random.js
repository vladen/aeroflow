'use strict';

import { isInteger, mathFloor, mathRandom } from '../utilites';

export function randomDecimalEmitter(inclusiveMin, exclusiveMax) {
  return (next, done, context) => {
    while(context.active) next(inclusiveMin + exclusiveMax * mathRandom());
    done();
  };
}

export function randomIntegerEmitter(inclusiveMin, exclusiveMax) { 
  return (next, done, context) => {
    while(context.active) next(mathFloor(inclusiveMin + exclusiveMax * mathRandom()));
    done();
  };
}

export function randomEmitter(inclusiveMin, exclusiveMax) {
  inclusiveMin = +inclusiveMin || 0;
  exclusiveMax = +exclusiveMax || 1;
  exclusiveMax -= inclusiveMin;
  return isInteger(inclusiveMin) && isInteger(exclusiveMax)
    ? randomIntegerEmitter(inclusiveMin, exclusiveMax)
    : randomDecimalEmitter(inclusiveMin, exclusiveMax);
}
