export default (aeroflow, assert) => describe('catch', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.catch));

  describe('catch()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.catch(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch().run(fail, done))));

    it('Supresses error emitted by flow', () =>
      assert.eventually.isBoolean(new Promise((done, fail) => 
        aeroflow(new Error('test')).catch().run(fail, done))));
  });

  describe('catch(@alternate:function)', () => {
    it('Does not call @alternative when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch(fail).run(fail, done))));

    it('Does not call @alternate when flow does not emit error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').catch(fail).run(done, fail))));

    it('Calls @alternate when flow emits error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(done).run(fail, fail))));

    it('Emits value returned by @alternate when flow emits error', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(() => alternate).run(done, fail)),
        alternate);
    });
  });

  describe('catch(@alternate:!function)', () => {
    it('Emits @alternate value instead of error emitted by flow', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(alternate).run(done, fail)),
        alternate);
    });
  });
});
