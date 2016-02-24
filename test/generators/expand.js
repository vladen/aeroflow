const noop = () => {};

export default (aeroflow, assert) => describe('.expand', () => {
  it('Is static method', () =>
    assert.isFunction(aeroflow.expand));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.expand(), 'Aeroflow'));
  });

  describe('(@expander:function)', () => {
    it('Calls @expander', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.expand(done).take(1).run(fail, fail))));

    it('Passes undefined to @expander as first argument when no seed is specified', () =>
      assert.eventually.isUndefined(new Promise((done, fail) =>
        aeroflow.expand(done).take(1).run(fail, fail))));

    it('Passes value returned by @expander to @expander as first argument on subsequent iteration', () => {
      const expectation = {};
      let iteration = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow
          .expand(value => iteration++
              ? done(value)
              : expectation)
          .take(2)
          .run(noop, fail)),
        expectation);
    });

    it('Passes zero-based index of iteration to @expander as second argument', () => {
      const indices = [], expectation = [0, 1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow
          .expand((_, index) => indices.push(index))
          .take(expectation.length)
          .run(noop, () => done(indices))),
        expectation);
    });

    it('Passes context data to @expander as third argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.expand((_, __, context) => done(context)).take(1).run(fail, fail, data)),
        data);
    });

    it('Emits "next" notification with value returned by @expander', () => {
      const value = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.expand(() => value).take(1).run(done, fail)),
        value);
    });
  });

  describe('(@expander:function, @seed:any)', () => {
    it('Passes @seed to @expander as first argument', () => {
      const seed = 42, expectation = seed;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.expand(done, seed).take(1).run(fail, fail)),
        expectation);
    });
  });
});
