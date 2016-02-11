export default (aeroflow, assert) => describe('catch', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.catch));

  describe('aeroflow().catch()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.catch(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch().run(fail, done))));

    it('Supresses error emitted by flow', () =>
      assert.eventually.isBoolean(new Promise((done, fail) => 
        aeroflow(new Error('test')).catch().run(fail, done))));
  });

  describe('aeroflow().catch(@alternative:function)', () => {
    it('Does not call @alternative when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch(fail).run(fail, done))));

    it('Does not call @alternative when flow does not emit error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).catch(fail).run(done, fail))));

    it('Calls @alternative when flow emits error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('tests')).catch(done).run(fail, fail))));

    it('Emits value returned by @alternative when flow emits error', () => {
      const alternative = 'caught';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(() => alternative).run(done, fail)),
        alternative);
    });
  });

  describe('aeroflow().catch(@alternative:!function)', () => {
    it('Emits @alternative value when flow emits error', () => {
      const alternative = 'caught';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(alternative).run(done, fail)),
        alternative);
    });
  });
});
