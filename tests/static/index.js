'use strict';

import emptyTests from './empty';
import expandTests from './expand';
import justTests from './just';

const tests = [
  emptyTests,
  expandTests,
  justTests
];

export default (aeroflow, assert) => describe('static members', () =>
  tests.forEach(test => test(aeroflow, assert)));
