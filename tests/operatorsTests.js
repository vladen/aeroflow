'use strict';

import averageOperatorTests from './operators/average';
import countOperatorTests from './operators/count';
import maxOperatorTests from './operators/max';
import minOperatorTests from './operators/min';
import toStringOperatorTests from './operators/toString';

const tests = [
  averageOperatorTests,
  countOperatorTests,
  maxOperatorTests,
  minOperatorTests,
  toStringOperatorTests
];

export default (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));