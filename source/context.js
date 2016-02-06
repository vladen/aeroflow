'use strict';

import { AEROFLOW, CLASS, PROTOTYPE } from './symbols';
import { objectDefineProperties, objectDefineProperty } from './utilites';

export class Context {
  constructor(data, sources) {
    objectDefineProperties(this, {
      data: { value: data },
      sources: { value: sources }
    });
  }
}
objectDefineProperty(Context[PROTOTYPE], CLASS, { value: `${AEROFLOW}.Context` });
