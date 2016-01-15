'use strict';

import { Aeroflow } from './aeroflow';
import { repeatStatic } from './repeat';
import { isFunction } from './utilites';

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
function expand(expander, seed) {
  return new Aeroflow(isFunction(expander)
    ? (next, done, context) => {
        let index = 0
          , value = seed;
        while (context())
          next(value = expander(value, index++, context.data));
        done();
      }
    : repeatStatic(expander));
}

export { expand };
