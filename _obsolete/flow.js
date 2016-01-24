'use strict';

import { append } from './append';
import { count } from './count';
import { delay } from './delay';
import { dump } from './dump';
import { every } from './every';
import { filter } from './filter';
import { join } from './join';
import { map } from './map';
import { max } from './max';
import { min } from './min';
import { prepend } from './prepend';
import { reduce } from './reduce';
import { run } from './run';
import { AEROFLOW, CLASS, EMITTER, PROTOTYPE } from './symbols';
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
  objectDefineProperty(this, EMITTER, { value: emitter });
}
objectDefineProperties(Aeroflow[PROTOTYPE], {
  [CLASS]: { value: AEROFLOW },
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
  toSet: { value: toSet }
});
function flow(emitter) {
  return new Aeroflow(emitter);
}

export { Aeroflow, flow };
