'use strict';

import { CLASS_AEROFLOW } from './classes';
import create from './create';
import emit from './emit';
import empty from './empty';
import expand from './expand';
import just from './just';
import random from './random';
import range from './range';
import repeat from './repeat';
import { SYMBOL_EMITTER } from './symbols';
import { objectDefineProperties, objectDefineProperty } from './utilites';

class Aeroflow {
  constructor(emitter) {
    objectDefineProperty(this, SYMBOL_EMITTER, { value: emitter });
  }
}
objectDefineProperty(Aeroflow, SYMBOL_TO_STRING_TAG, { value: CLASS_AEROFLOW });

const aeroflow = (...sources) => new Aeroflow(emit(...sources));
objectDefineProperties(aeroflow, {
  create: { value: create }
, empty: { value: empty }
, expand: { value: expand }
, just: { value: just }
, random: { value: random }
, range: { value: range }
, repeat: { value: repeat }
});

export { aeroflow, Aeroflow };
