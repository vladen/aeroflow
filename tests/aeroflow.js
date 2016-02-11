'use strict';

import operatorsTest from './operatorsTests';
import emittersTest from './emittersTests';

export default (aeroflow, assert) => {
  operatorsTest(aeroflow, assert);
  emittersTest(aeroflow, assert);
};