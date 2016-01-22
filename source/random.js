'use strict';

import { flow } from './flow';
import { isInteger, mathFloor, mathRandom } from './utilites';

const randomEmitter = (inclusiveMin, exclusiveMax) => (next, done, context) => {
  while(context.active)
    next(inclusiveMin + exclusiveMax * mathRandom());
  done();
};

const randomIntegerEmitter = (inclusiveMin, exclusiveMax) => (next, done, context) => {
  while(context.active)
    next(mathFloor(inclusiveMin + exclusiveMax * mathRandom()));
  done();
};

/**
  * Returns new flow emitting random numbers.
  * @static
  *
  * @example
  * aeroflow.random().take(3).dump().run();
  * aeroflow.random(0.1).take(3).dump().run();
  * aeroflow.random(null, 0.1).take(3).dump().run();
  * aeroflow.random(1, 9).take(3).dump().run();
  */
const random = (inclusiveMin, exclusiveMax) => {
  inclusiveMin = +inclusiveMin || 0;
  exclusiveMax = +exclusiveMax || 1;
  exclusiveMax -= inclusiveMin;
  return flow(isInteger(inclusiveMin) && isInteger(exclusiveMax)
    ? randomIntegerEmitter(inclusiveMin, exclusiveMax)
    : randomEmitter(inclusiveMin, exclusiveMax));
};

export { random, randomEmitter, randomIntegerEmitter };
