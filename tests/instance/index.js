'use strict';

import averageTests from './average';
import catchTests from './catch';
import countTests from './count';
import filterTests from './filter';
import maxTests from './max';
import minTests from './min';
import reduceTests from './reduce';
import toArrayTests from './toArray';
import toSetTests from './toSet';
import toStringTests from './toString';
import everyTests from './every';
import someTests from './some';
import distinctTests from './distinct';
import takeTests from './take';

const tests = [
  averageTests,
  catchTests,
  countTests,
  distinctTests,
  everyTests,
  filterTests,
  maxTests,
  minTests,
  reduceTests,
  someTests,
  takeTests,
  toArrayTests,
  toSetTests,
  toStringTests
];

export default (aeroflow, assert) => describe('instance members', () =>
  tests.forEach(test => test(aeroflow, assert)));
