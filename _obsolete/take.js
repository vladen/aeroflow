'use strict';

import { empty } from './aeroflow';
import { flow } from './flow';
import { EMITTER } from './symbols';
import { toArrayEmitter } from './toArray';
import { isFunction, isNumber, mathMax } from './utilites';

const takeFirstEmitter = (emitter, count) => (next, done, context) => {
  let index = 1;
  context = context.spawn();
  emitter(
    value => {
      next(value);
      if (count <= index++) context.done();
    },
    done,
    context);
};

const takeLastEmitter = (emitter, count) => (next, done, context) => toArrayEmitter(emitter)(
  value => {
    const limit = value.length;
    let index = mathMax(limit - 1 - count, 0);
    while (index < limit)
      next(value[index++]);
  },
  done,
  context);

const takeWhileEmitter = (emitter, predicate) => (next, done, context) => {
  let index = 0;
  context = context.spawn();
  emitter(
    value => predicate(value, index++, context.data)
      ? next(value)
      : context.done(),
    done,
    context);
};

function take(condition) {
  return arguments.length
    ? isNumber(condition)
      ? condition === 0
        ? empty
        : flow(condition > 0
          ? takeFirstEmitter(
              this[EMITTER],
              condition)
          : takeLastEmitter(
              this[EMITTER],
              condition))
      : isFunction(condition)
        ? flow(takeWhileEmitter(
            this[EMITTER],
            condition))
        : condition
          ? this
          : empty
    : this;
}

export { take, takeFirstEmitter, takeLastEmitter, takeWhileEmitter };
