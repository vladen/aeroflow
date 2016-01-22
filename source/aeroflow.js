'use strict';

import { append } from './append';
import { count } from './count';
import { create } from './create';
import { delay } from './delay';
import { dump } from './dump';
import { empty, emptyEmitter } from './empty';
import { every } from './every';
import { expand } from './expand';
import { filter } from './filter';
import { join } from './join';
import { just, justEmitter } from './just';
import { map } from './map';
import { max } from './max';
import { min } from './min';
import { prepend } from './prepend';
import { random } from './random';
import { range } from './range';
import { reduce } from './reduce';
import { repeat } from './repeat';
import { run } from './run';
import { AEROFLOW, ARRAY, CLASS, EMITTER, FUNCTION, ITERATOR, PROMISE, PROTOTYPE } from './symbols';
import { skip } from './skip';
import { some } from './some';
import { sum } from './sum';
import { take } from './take';
import { tap } from './tap';
import { timestamp } from './timestamp';
import { toArray } from './toArray';
import { toMap } from './toMap';
import { toSet } from './toSet';
import { objectDefineProperties, objectDefineProperty } from './utilites';

const emitters = new Map;
// todo: Aerobus.Channel, Aerobus.Section
emitters.add(AEROFLOW, source => source[EMITTER]);
emitters.add(ARRAY, source => (next, done, context) => {
  let index = -1;
  while (context() && ++index < source.length)
    next(source[index]);
  done();
});
emitters.add(FUNCTION, source => (next, done, context) => {
  emit(source(context.data))(next, done, context);
});
emitters.add(PROMISE, source => (next, done, context) => {
  source.then(
    value => emit(value)(next, done, context),
    error => {
      done(error);
      throwError(error);
    });
});

function Aeroflow(emitter) {
  objectDefineProperty(this, EMITTER, { value: emitter });
  /*
  return this instanceof Aeroflow
    ? objectDefineProperty(this, EMITTER, { value: emitter })
    : new Aeroflow(emitter);
  */
}
objectDefineProperties(Aeroflow[PROTOTYPE], {
  [CLASS]: { value: AEROFLOW },
  append: { value: append },
  count: { value: count },
  delay: { value: delay },
  dump: { value: dump },
  emitters: { value: emitters },
  every: { value: every },
  filter: { value: filter },
  join: { value: join },
  map: { value: map },
  max: { value: max },
  min: { value: min },
  prepend: { value: prepend },
  reduce: { value: reduce },
  run: { value: run },
  skip: { value: skip },
  some: { value: some },
  sum: { value: sum },
  take: { value: take },
  tap: { value: tap },
  timestamp: { value: timestamp },
  toArray: { value: toArray },
  toMap: { value: toMap },
  toSet: { value: toSet }
});

// Returns function emitting values from multiple arbitrary sources.
function emit(...sources) {
  switch (sources.length) {
    case 0:
      return emptyEmitter(); // todo: Aeroplan
    case 1:
      const
        emitter = emitters[classOf(source)],
        source = sources[0];
      if (isFunction(emitter))
        return emitter(source);
      if (isObject(source) && ITERATOR in source)
        return (source) => (next, done, context) => {
          const iterator = source[ITERATOR]();
          let iteration;
          while (context() && !(iteration = iterator.next()).done)
            next(iteration.value);
          done();
        };
      return justEmitter(source);
    default:
      return (next, done, context) => {
        let index = -1;
        const limit = sources.length, proceed = () => {
          ++index < limit
            ? emit(sources[index])(next, proceed, context)
            : done();
        };
        proceed();
      };
  }
}

function aeroflow(...sources) {
  return new Aeroflow(emit(...sources));
}
objectDefineProperties(aeroflow, {
  constructor: { value: Aeroflow },
  create: { value: create },
  empty: { value: empty },
  expand: { value: expand },
  just: { value: just },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});

export { Aeroflow, aeroflow };
