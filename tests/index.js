import factoryTests from './factory';

import emptyTests from './empty';
import adaptersTests from './adapters';
import notifiersTests from './notifiers';
import operatorsTests from './operators';

import expandGeneratorTests from './generators/expand';
import justGeneratorTests from './generators/just';
import randomGeneratorTests from './generators/random';
import repeatGeneratorTests from './generators/repeat';

import averageOperatorTests from './operators/average';
import catchOperatorTests from './operators/catch';
import coalesceOperatorTests from './operators/coalesce';
import countOperatorTests from './operators/count';
import distinctOperatorTests from './operators/distinct';
import everyOperatorTests from './operators/every';
import filterOperatorTests from './operators/filter';
import groupOperatorTests from './operators/group';
import mapOperatorTests from './operators/map';
import maxOperatorTests from './operators/max';
import meanOperatorTests from './operators/mean';
import minOperatorTests from './operators/min';
import reduceOperatorTests from './operators/reduce';
import reverseOperatorTests from './operators/reverse';
import skipOperatorTests from './operators/skip';
import sliceOperatorTests from './operators/slice';
import someOperatorTests from './operators/some';
import sortOperatorTests from './operators/sort';
import sumOperatorTests from './operators/sum';
import takeOperatorTests from './operators/take';
import toArrayOperatorTests from './operators/toArray';
import toMapOperatorTests from './operators/toMap';
import toSetOperatorTests from './operators/toSet';
import toStringOperatorTests from './operators/toString';

const tests = [
  factoryTests,

  emptyTests,
  adaptersTests,
  notifiersTests,
  operatorsTests,

  expandGeneratorTests,
  justGeneratorTests,
  randomGeneratorTests,
  repeatGeneratorTests,

  averageOperatorTests,
  catchOperatorTests,
  coalesceOperatorTests,
  countOperatorTests,
  distinctOperatorTests,
  everyOperatorTests,
  filterOperatorTests,
  // groupOperatorTests,
  mapOperatorTests,
  maxOperatorTests,
  meanOperatorTests,
  minOperatorTests,
  reduceOperatorTests,
  reverseOperatorTests,
  skipOperatorTests,
  sliceOperatorTests,
  someOperatorTests,
  // sortOperatorTests,
  sumOperatorTests,
  takeOperatorTests,
  toArrayOperatorTests,
  // toMapOperatorTests,
  toSetOperatorTests,
  toStringOperatorTests
];

export default (aeroflow, expect, sinon) => {
  const error = new Error('test');
  function fail() {
    throw error;
  }
  function noop() {}
  function spy(result) {
    return sinon.spy(typeof result === 'function' ? result : () => result);
  }
  class Context {
    get done() {
      return this._done || (this._done = spy());
    }
    set done(result) {
      this._done = spy(result);
    }
    get next() {
      return this._next || (this._next = spy());
    }
    set next(result) {
      this._next = spy(result);
    }
  }
  Object.defineProperties(Context.prototype, {
    error: { value: error },
    fail: { value: fail },
    noop: { value: noop },
    spy: { value: spy }
  });
  function execute(arrange, act, assert) {
    if (arguments.length < 3) {
      assert = act;
      act = arrange;
      arrange = null;
    }
    const context = new Context;
    if (arrange) arrange(context);
    return Promise
      .resolve(act(context))
      .catch(Function())
      .then(result => {
        context.result = result;
        assert(context);
      });
  }
  tests.forEach(test => test(aeroflow, execute, expect));
}
