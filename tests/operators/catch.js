export default (aeroflow, assert) => describe('Aeroflow#catch', () => {
  it('is instance method', () =>
    assert.isFunction(aeroflow.empty.catch));

  describe('()', () => {
    it('returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.catch(), 'Aeroflow'));

    it('emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch().run(fail, done))));

    it('supresses error emitted by flow', () =>
      assert.eventually.isBoolean(new Promise((done, fail) => 
        aeroflow(new Error('test')).catch().run(fail, done))));
  });

  describe('(@alternative:function)', () => {
    it('does not call @alternative when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch(fail).run(fail, done))));

    it('does not call @alternative when flow does not emit error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).catch(fail).run(done, fail))));

    it('calls @alternative when flow emits error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('tests')).catch(done).run(fail, fail))));

    it('emits value returned by @alternative when flow emits error', () => {
      const alternative = 'caught';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(() => alternative).run(done, fail)),
        alternative);
    });
  });

  describe('(@alternative:!function)', () => {
    it('emits @alternative value when flow emits error', () => {
      const alternative = 'caught';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(alternative).run(done, fail)),
        alternative);
    });
  });
});
