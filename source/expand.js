'use strict';

import { flow } from './flow';
import { repeatEmitter } from './repeat';
import { isFunction } from './utilites';

const expandEmitter = (expander, seed) => (next, done, context) => {
  let index = 0, value = seed;
  while (context.active)
    next(value = expander(value, index++, context.data));
  done();
};

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
const expand = (expander, seed) => flow(isFunction(expander)
  ? expandEmitter(expander, seed)
  : repeatEmitter(expander));

export { expand, expandEmitter };
