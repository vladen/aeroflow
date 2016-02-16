'use strict';

import staticMethodsTests from './static/index';
import instanceMethodsTests from './instance/index';

const tests = [
  staticMethodsTests,
  instanceMethodsTests
];

export default (aeroflow, assert) =>
  tests.forEach(test => test(aeroflow, assert));
