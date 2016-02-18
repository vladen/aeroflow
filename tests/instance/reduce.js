export default (aeroflow, assert) => describe('reduce', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.reduce));

  describe('reduce()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce().run(fail, done))));

    it('Emits first value emitted by flow when flow is not empty', () => {
      const values = [1, 2];
      assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).reduce().run(done, fail)),
        values[0]);
    });
  });

  describe('reduce(@reducer:function)', () => {
    it('Does not call @reducer when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(fail).run(fail, done))));

    it('Does not call @reducer when flow emits single @value', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).reduce(fail).run(done, fail))));

    it('Calls @reducer when flow emits several v@alues', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(done).run(fail, fail))));

    it('Emits error thrown by @reducer', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Emits @value emitted by flow when flow emits single @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).reduce(() => 'test').run(done, fail)),
        value);
    });

    it('Emits @value returned by @reducer when flow emits several @values', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).reduce(() => value).run(done, fail)),
        value);
    });

    it('Passes first and second @values emitted by flow to @reducer as first and second arguments on first iteration', () => {
      const values = [1, 2];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).reduce((first, second) => done([first, second])).run(fail, fail)),
        values);
    });

    it('Passes zero-based @index of iteration to @reducer as third argument', () =>
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, index) => done(index)).run(fail, fail)),
        0));

    it('Passes context @data to @reducer as forth argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, ___, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });
  });

  describe('reduce(@reducer:function, @seed)', () => {
    it('Emits @seed value when flow is empty', () => {
      const seed = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(() => {}, seed).run(done, fail)),
        seed);
    });

    it('Passes @seed to @reducer as first argument on first iteration', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').reduce(done, seed).run(fail, fail)),
        seed);
    });
  });

  describe('reduce(@reducer:!function)', () => {
    it('Emits @reducer value when flow is empty', () => {
      const reducer = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.reduce(reducer).run(done, fail)),
        reducer);
    });

    it('Emits @reducer value when flow is not empty', () => {
      const reducer = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(1, 2).reduce(reducer).run(done, fail)),
        reducer);
    });
  });
});
