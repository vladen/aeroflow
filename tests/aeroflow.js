'use strict';

const noop = () => {};

export default (aeroflow, assert) => {
  describe('aeroflow', () => {
    it('Is a function', () =>
      assert.isFunction(aeroflow));

    describe('aeroflow()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow(), 'Aeroflow'));

      it('Returns empty flow emitting "done" notification argumented with "true"', () =>
        assert.eventually.isTrue(new Promise((done, fail) =>
          aeroflow().run(fail, done))));
    });

    describe('aeroflow(@source:aeroflow)', () => {
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
            results.push(value);
            if (index === source.length - 1) done(results);
          }, fail)),
          source);
      });
    });

    describe('aeroflow(@source:array)', () => {
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
            results.push(value);
            if (index === source.length - 1) done(results);
          }, fail)),
          source);
      });
    });

    describe('aeroflow(@source:date)', () => {
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

    describe('aeroflow(@source:error)', () => {
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

    describe('aeroflow(@source:function)', () => {
      it('Calls @source and passes context data as first argument', () => {
        const data = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(data => done(data)).run(fail, fail, data)),
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

    describe('aeroflow(@source:iterable)', () => {
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
            results.push(value);
            if (index === source.length - 1) done(results);
          }, fail)),
          source);
      });
    });

    describe('aeroflow(@source:null)', () => {
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

    describe('aeroflow(@source:promise)', () => {
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

    describe('aeroflow(@source:string)', () => {
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

    describe('aeroflow(@source:undefined)', () => {
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
  });
}
