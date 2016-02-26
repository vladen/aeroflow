import emptyGeneratorTests from './generators/empty';
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
import joinOperatorTests from './operators/join';
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
import tapOperatorTests from './operators/tap';
import toArrayOperatorTests from './operators/toArray';
import toMapOperatorTests from './operators/toMap';
import toSetOperatorTests from './operators/toSet';
import toStringOperatorTests from './operators/toString';

const noop = () => {};

export default (aeroflow, assert) => describe('aeroflow', () => {
  it('Is function', () =>
    assert.isFunction(aeroflow));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow(), 'Aeroflow'));

    it('Returns empty flow emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow().run(fail, done))));
  });

  describe('(@source:aeroflow)', () => {
    it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(aeroflow.empty).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(aeroflow([1, 2])).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end', () =>
      assert.eventually.isFalse(new Promise(done =>
        aeroflow(aeroflow([1, 2]).take(1)).run(noop, done))));

    it('Returns flow not emitting "next" notification when @source is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(aeroflow.empty).run(fail, done))));

    it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', () => {
      const source = [1, 2], results = [];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(aeroflow(source)).run((result, index) => {
          results.push(result);
          if (index === source.length - 1) done(results);
        }, fail)),
        source);
    });
  });

  describe('(@source:array)', () => {
    it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow([]).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow([1, 2]).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end', () =>
      assert.eventually.isFalse(new Promise(done =>
        aeroflow([1, 2]).take(1).run(noop, done))));

    it('Returns flow not emitting "next" notification when @source is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow([]).run(fail, done))));

    it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', () => {
      const source = [1, 2], results = [];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(source).run((result, index) => {
          results.push(result);
          if (index === source.length - 1) done(results);
        }, fail)),
        source);
    });
  });

  describe('(@source:date)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "next" notification argumented with @source', () => {
      const source = new Date;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  describe('(@source:error)', () => {
    it('Returns flow not emitting "next" notification', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('test')).run(fail, done))));

    it('Returns flow emitting "done" notification argumented with @source', () => {
      const source = new Error('test');
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(fail, done)),
        source);
    });
  });

  describe('(@source:function)', () => {
    it('Calls @source and passes context data as first argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(context => done(context)).run(fail, fail, data)),
        data);
    });

    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "done" notification argumented with error thrown by @source', () => {
      const error = new Error('test');
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(() => { throw error }).run(fail, done)),
        error);
    });

    it('Returns flow emitting "next" notification argumented with result of @source invocation', () => {
      const result = 42;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(() => result).run(done, fail)),
        result);
    });
  });

  describe('(@source:iterable)', () => {
    it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow(new Set).run(fail, done))));

    it('Returns flow eventually emitting "done" notification argumented with "true" when source is not empty', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(new Set([1, 2])).run(noop, done))));

    it('Returns flow not emitting "next" notification when source is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Set).run(fail, done))));

    it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', () => {
      const source = [1, 2], results = [];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(new Set(source)).run((result, index) => {
          results.push(result);
          if (index === source.length - 1) done(results);
        }, fail)),
        source);
    });
  });

  describe('(@source:null)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "next" notification with @source', () => {
      const source = null;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  describe('(@source:promise)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true" when @source resolves', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(Promise.resolve()).run(noop, done))));

    it('Returns flow emitting "done" notification argumented with error rejected by @source', () => {
      const error = new Error('test'), source = Promise.reject(error);
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(fail, done)),
        error);
    });

    it('Returns flow emitting "next" notification argumented with result resolved by @source', () => {
      const result = 42, source = Promise.resolve(result);
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        result);
    });
  });

  describe('(@source:string)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow('test').run(noop, done))));

    it('Returns flow emitting "next" notification argumented with @source', () => {
      const source = 'test';
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  describe('(@source:undefined)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "next" notification argumented with @source', () => {
      const source = undefined;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  [
    emptyGeneratorTests,
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
    groupOperatorTests,
    joinOperatorTests,
    mapOperatorTests,
    maxOperatorTests,
    meanOperatorTests,
    minOperatorTests,
    reduceOperatorTests,
    reverseOperatorTests,
    skipOperatorTests,
    sliceOperatorTests,
    someOperatorTests,
    sortOperatorTests,
    sumOperatorTests,
    takeOperatorTests,
    tapOperatorTests,
    toArrayOperatorTests,
    toMapOperatorTests,
    toSetOperatorTests,
    toStringOperatorTests
  ].forEach(test => test(aeroflow, assert));
});
