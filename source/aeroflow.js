'use strict';

import { append } from './append';
import { CLASS_AEROFLOW } from './classes';
import { count } from './count';
import { create } from './create';
import { delay } from './delay';
import { dump } from './dump';
import { emit } from './emit';
import { empty } from './empty';
import { every } from './every';
import { expand } from './expand';
import { filter } from './filter';
import { join } from './join';
import { just } from './just';
import { map } from './map';
import { max } from './max';
import { min } from './min';
import { prepend } from './prepend';
import { random } from './random';
import { range } from './range';
import { reduce } from './reduce';
import { repeat } from './repeat';
import { run } from './run';
import { SYMBOL_EMITTER, SYMBOL_PROTOTYPE, SYMBOL_TO_STRING_TAG } from './symbols';
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

function Aeroflow(emitter) {
  objectDefineProperty(this, SYMBOL_EMITTER, { value: emitter });
  /*
  return this instanceof Aeroflow
    ? objectDefineProperty(this, SYMBOL_EMITTER, { value: emitter })
    : new Aeroflow(emitter);
  */
}
objectDefineProperties(Aeroflow[SYMBOL_PROTOTYPE], {
  append: { value: append },
  count: { value: count },
  delay: { value: delay },
  dump: { value: dump },
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
  toSet: { value: toSet },
  [SYMBOL_TO_STRING_TAG]: { value: CLASS_AEROFLOW }
});

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
