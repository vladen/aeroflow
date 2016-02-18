export default (aeroflow, assert) => describe('coalesce', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.coalesce));

  describe('coalesce()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.coalesce(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.coalesce().run(fail, done))));
  });

  describe('coalesce(@alternate:function)', () => {
    it('Does not call @alternate when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').coalesce(fail).run(done, fail))));

    it('Does not call @alternate when flow emits error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('test')).coalesce(fail).run(fail, done))));

    it('Emits value returned by @alternate when flow is empty', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.coalesce(() => alternate).run(done, fail)),
        alternate);
    });
  });

  describe('catch(@alternate:!function)', () => {
    it('Emits @alternate value when flow is empty', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.coalesce(alternate).run(done, fail)),
        alternate);
    });
  });
});
