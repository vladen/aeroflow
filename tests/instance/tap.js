export default (aeroflow, assert) => describe('tap', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.tap));

  describe('tap()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.tap(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.tap().run(fail, done))));
  });

  describe('tap(@callback:function)', () => {
    it('Does not call @callback when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.tap(fail).run(fail, done))));

    it('Calls @callback when flow emits several values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).tap(done).run(fail, fail))));

    it('Emits error thrown by @callback', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).tap(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Passes context data to @callback as third argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').tap((_, __, data) => done(data)).run(fail, fail, data)),
        data);
    });

    it('Emits immutable @values after tap @callback was applied', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).tap((item) => item * 2).toArray().run(done, fail)),
        values);
    });
  });

  describe('tap(@callback:!function)', () => {
    it('Emits immutable @values after tap @callback was applied', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).tap(1).toArray().run(done, fail)),
        values);
    });
  });
});