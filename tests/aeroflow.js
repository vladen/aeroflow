'use strict';

import staticMethodsTests from './staticMethods.js';
import factoryTests from './factory.js';
import instanceTests from './instance.js';
import averageOperatorTests from './operators/average';
import catchOperatorTests from './operators/catch';
import countOperatorTests from './operators/count';
import filterOperatorTests from './operators/filter';
import maxOperatorTests from './operators/max';
import minOperatorTests from './operators/min';
import reduceOperatorTests from './operators/reduce';
import toArrayOperatorTests from './operators/toArray';
import toSetOperatorTests from './operators/toSet';
import toStringOperatorTests from './operators/toString';

const tests = [
  // factoryTests,
  // staticMethodsTests,
  // instanceTests,
  averageOperatorTests,
  catchOperatorTests,
  countOperatorTests,
  filterOperatorTests,
  maxOperatorTests,
  minOperatorTests,
  reduceOperatorTests,
  toArrayOperatorTests,
  toSetOperatorTests,
  toStringOperatorTests
];

export default (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));
