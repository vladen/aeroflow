'use strict';

import operatorsTest from './operators/index';
import generatorsTest from './generators/index';

const tests = [
  ...operatorsTest,
  ...generatorsTest
];

export default (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));