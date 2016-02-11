'use strict';

import expandEmittersTests from './emitters/expand';

const tests = [
  expandEmittersTests
];

export default (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));