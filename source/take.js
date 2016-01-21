'use strict';

import { Aeroflow } from './aeroflow';
import { empty } from './empty';
import { EMITTER } from './symbols';
import { toArrayEmitter } from './toArray';
import { isFunction, isNumber, mathMax } from './utilites';

const takeFirstEmitter = (emitter, count) => (next, done, context) => {
  let index = 1;
  context = context.spawn();
  emitter(
    value => {
      next(value);
      if (count <= index++) context.end();
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
      : context.end(),
    done,
    context);
};

function take(condition) {
  return arguments.length
    ? isNumber(condition)
      ? condition === 0
        ? empty
        : new Aeroflow(condition > 0
          ? takeFirstEmitter(
              this[EMITTER],
              condition)
          : takeLastEmitter(
              this[EMITTER],
              condition))
      : isFunction(condition)
        ? new Aeroflow(takeWhileEmitter(
            this[EMITTER],
            condition))
        : condition
          ? this
          : empty
    : this;
}

export { take, takeFirstEmitter, takeLastEmitter, takeWhileEmitter };
