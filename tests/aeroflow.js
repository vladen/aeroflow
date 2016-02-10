'use strict';

import staticMethodsTests from './staticMethods.js';
import factoryTests from './factory.js';
import instanceTests from './instance.js';
import averageOperatorTests from './operators/average';
import countOperatorTests from './operators/count';
import maxOperatorTests from './operators/max';
import minOperatorTests from './operators/min';
import toStringOperatorTests from './operators/toString';

const tests = [
  // factoryTests,
  // staticMethodsTests,
  // instanceTests,
  averageOperatorTests,
  countOperatorTests,
  maxOperatorTests,
  minOperatorTests,
  toStringOperatorTests
];

export default (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));
