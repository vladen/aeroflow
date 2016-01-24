'use strict';

import { isFunction } from './utilites';
import { flow } from './flow';
import { expand as expandEmitter, repeat as repeatEmitter } from './emitters';

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
export default function expand(expander, seed) {
  return flow(isFunction(expander)
    ? expandEmitter(expander, seed)
    : repeatEmitter(expander));
}
