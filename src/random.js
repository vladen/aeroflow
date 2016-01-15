'use strict';

import { Aeroflow } from './aeroflow';
import { isInteger, mathFloor, mathRandom } from './utilites';

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
function random(inclusiveMin, exclusiveMax) {
  inclusiveMin = +inclusiveMin || 0;
  exclusiveMax = +exclusiveMax || 1;
  exclusiveMax -= inclusiveMin;
  let generator = isInteger(inclusiveMin) && isInteger(exclusiveMax)
    ? () => mathFloor(inclusiveMin + exclusiveMax * mathRandom())
    : () => inclusiveMin + exclusiveMax * mathRandom()
  return new Aeroflow((next, done, context) => {
    while(context())
      next(generator());
    done();
  });
}

export { random };
