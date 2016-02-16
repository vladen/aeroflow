export default (aeroflow, assert) => describe('reduce', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.reduce));

  describe('reduce()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce().run(fail, done))));

    it('Emits nothing when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow('test').reduce().run(fail, done))));
  });

  describe('reduce(@reducer:function)', () => {
    it('Does not call @reducer when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(fail).run(fail, done))));

    it('Does not call @reducer when flow emits single value', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).reduce(fail).run(done, fail))));

    it('Calls @reducer when flow emits serveral values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(done).run(fail, fail))));

    it('Emits error thrown by @reducer', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Emits value emitted by flow when flow emits single value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).reduce(() => 'test').run(done, fail)),
        value);
    });

    it('Emits value returned by @reducer when flow emits several values', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).reduce(() => value).run(done, fail)),
        value);
    });

    it('Passes first and second values emitted by flow to @reducer as first and second arguments on first iteration', () => {
      const values = [1, 2];
      return assert.eventually.includeMembers(new Promise((done, fail) =>
        aeroflow(values).reduce((...args) => done(args)).run(fail, fail)),
        values);
    });

    it('Passes zero-based index of iteration to @reducer as third argument', () => {
      const expectation = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, index) => done(index)).run(fail, fail)),
        expectation);
    });

    it('Passes context data to @reducer as forth argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, ___, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });
  });

  describe('reduce(@reducer:function, @seed:any)', () => {
    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(() => {}, 42).run(fail, done))));

    it('Passes @seed to @reducer as first argument on first iteration', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').reduce(done, seed).run(fail, fail)),
        seed);
    });
  });

  describe('reduce(@reducer:function, @seed:any, true)', () => {
    it('Emits @seed when flow is empty', () => {
      const seed = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(() => {}, seed, true).run(done, fail)),
        seed);
    });
  });

  describe('reduce(@seed:!function)', () => {
    it('Emits @seed when flow is empty', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(seed).run(done, fail)),
        seed);
    });

    it('Emits @seed when flow is not empty', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(1, 2).reduce(seed).run(done, fail)),
        seed);
    });
  });
});
