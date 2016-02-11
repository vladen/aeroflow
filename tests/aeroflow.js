'use strict';

import operatorsTests from './operators/index';
import generatorsTests from './generators/index';

const tests = [
  ...operatorsTests,
  ...generatorsTests
];

export default (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));