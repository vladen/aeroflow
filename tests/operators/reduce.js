export default (aeroflow, assert) => describe('Aeroflow#reduce', () => {
  it('is instance method', () =>
    assert.isFunction(aeroflow.empty.reduce));

  describe('()', () => {
    it('returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));

    it('emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce().run(fail, done))));

    it('emits nothing when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow('test').reduce().run(fail, done))));
  });

  describe('(@reducer:function)', () => {
    it('does not call @reducer when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(fail).run(fail, done))));

    it('does not call @reducer when flow emits single value', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).reduce(fail).run(done, fail))));

    it('calls @reducer when flow emits serveral values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(done).run(fail, fail))));

    it('emits error thrown by @reducer', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(() => { throw error; }).run(fail, done)),
        error);
    });

    it('emits value emitted by flow when flow emits single value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).reduce(() => 'test').run(done, fail)),
        value);
    });

    it('emits value returned by @reducer when flow emits several values', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).reduce(() => value).run(done, fail)),
        value);
    });

    it('passes first and second values emitted by flow to @reducer as first and second arguments on first iteration', () => {
      const values = [1, 2];
      return assert.eventually.includeMembers(new Promise((done, fail) =>
        aeroflow(values).reduce((...args) => done(args)).run(fail, fail)),
        values);
    });

    it('passes zero-based index of iteration to @reducer as third argument', () => {
      const values = [1, 2, 3, 4], expectation = values.length - 2;
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(values).reduce((_, __, index) => {
          if (index === expectation) done();
        }).run(fail, fail)));
    });

    it('passes context data to @reducer as forth argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, ___, data) => done(data)).run(fail, fail, data)),
        data);
    });
  });

  describe('(@reducer:function, @seed:any)', () => {
    it('emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(() => {}, 42).run(fail, done))));

    it('passes @seed to @reducer as first argument on first iteration', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').reduce(done, seed).run(fail, fail)),
        seed);
    });
  });

  describe('(@reducer:function, @seed:any, true)', () => {
    it('emits @seed when flow is empty', () => {
      const seed = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(() => {}, seed, true).run(done, fail)),
        seed);
    });
  });

  describe('(@seed:!function)', () => {
    it('emits @seed when flow is empty', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(seed).run(done, fail)),
        seed);
    });

    it('emits @seed when flow is not empty', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(1, 2).reduce(seed).run(done, fail)),
        seed);
    });
  });

});
