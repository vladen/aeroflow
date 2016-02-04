'use strict';

import { CLASS, CONTEXT, PROTOTYPE } from './symbols';
import { objectDefineProperties, objectDefineProperty } from './utilites';

export class Context {
  constructor(data, flow) {
    objectDefineProperties(this, {
      data: { value: data },
      flow: { value: flow }
    });
  }
}
objectDefineProperty(Context[PROTOTYPE], CLASS, { value: CONTEXT });