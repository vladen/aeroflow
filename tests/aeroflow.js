'use strict';

import staticMethodsTests from './staticMethods.js';
import factoryTests from './factory.js';
import instanceTests from './instance.js';
import toStringOperatorTests from './operators/toString';

const tests = [
  // factoryTests,
  // staticMethodsTests,
  // instanceTests,
  toStringOperatorTests
];

export default (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));
