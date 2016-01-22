'use strict';

import { Aeroflow, flow } from './flow';
import { create } from './create';
import { empty, emptyEmitter } from './empty';
import { expand } from './expand';
import { just, justEmitter } from './just';
import { random } from './random';
import { range } from './range';
import { repeat } from './repeat';
import { AEROFLOW, ARRAY, EMITTER, FUNCTION, ITERATOR, PROMISE, PROTOTYPE } from './symbols';
import { classOf, isFunction, isObject, objectDefineProperties } from './utilites';

const aeroflowEmitter = source => source[EMITTER];

const arrayEmitter = source => (next, done, context) => {
  let index = -1;
  while (context.active && ++index < source.length)
    next(source[index]);
  done();
};

const functionEmitter = source => (next, done, context) => emit(source(context.data))(next, done, context);

const promiseEmitter = source => (next, done, context) => source.then(
  value => emit(value)(next, done, context),
  error => done(error));

const emitters = new Map(
  [AEROFLOW, aeroflowEmitter],
  [ARRAY, arrayEmitter],
  [FUNCTION, functionEmitter],
  [PROMISE, promiseEmitter]
);

function emit(...sources) {
  switch (sources.length) {
    case 0:
      return emptyEmitter(); // todo: Aeroplan
    case 1:
      const
        source = sources[0],
        emitter = emitters[classOf(source)];
      if (isFunction(emitter))
        return emitter(source);
      if (isObject(source) && ITERATOR in source)
        return (next, done, context) => {
          const iterator = source[ITERATOR]();
          let iteration;
          while (context.active && !(iteration = iterator.next()).done)
            next(iteration.value);
          done();
        };
      return justEmitter(source);
    default:
      return (next, done, context) => {
        let index = -1;
        const limit = sources.length, proceed = () => context.active && ++index < limit
          ? emit(sources[index])(next, proceed, context)
          : done();
        proceed();
      };
  }
}
function aeroflow(...sources) {
  return flow(emit(...sources));
}
// todo: Aerobus.Channel, Aerobus.Section
objectDefineProperties(aeroflow, {
  create: { value: create },
  emitters: { value: emitters },
  empty: { value: empty },
  expand: { value: expand },
  just: { value: just },
  operators: { value: Aeroflow[PROTOTYPE] },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});

export default aeroflow;
