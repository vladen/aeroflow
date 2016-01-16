'use strict';

import { Aeroflow } from './aeroflow';
import { isFunction } from './utilites';

const repeatEmitter = value => (next, done, context) => {
  while(context())
    next(value);
  done();
};

const repeatDynamicEmitter = repeater => (next, done, context) => {
  let index = 0, result;
  while (context() && false !== (result = repeater(index++, context.data)))
    next(result);
  done();
};

/**
  * Creates flow of repeting values.
  * @static
  *
  * @param {function|any} repeater Arbitrary scalar value to repeat; or function invoked repeatedly with two arguments: 
  *   index - index of the value being emitted,
  *   data - contextual data.
  * @returns {Aeroflow} new flow.
  *
  * @example
  * aeroflow.repeat(new Date().getSeconds(), 3).dump().run();
  * // next 1
  * // next 1
  * // next 1
  * // done
  * aeroflow.repeat(() => new Date().getSeconds(), 3).delay((value, index) => index * 1000).dump().run();
  * // next 1
  * // next 2
  * // next 3
  * // done
  * aeroflow.repeat(index => Math.pow(2, index), 3).dump().run();
  * // next 1
  * // next 2
  * // next 4
  * // done
  */
const repeat = value => new Aeroflow(isFunction(value)
  ? repeatDynamicEmitter(value)
  : repeatEmitter(value));

export { repeat, repeatDynamicEmitter, repeatEmitter };
