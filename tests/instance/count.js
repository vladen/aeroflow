export default (aeroflow, assert) => describe('count', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.count));

  describe('count()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.count(), 'Aeroflow'));

    it('Emits 0 when flow is empty', () =>
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.count().run(done, fail)),
        0));

    it('Emits 1 when flow emits single @value', () => {
      const expectation = 1;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).count().run(done, fail)),
        expectation);
    });

    it('Emits number of @values emitted by flow when flow emits several @values', () => {
      const values = [1, 2, 3], expectation = values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).count().run(done, fail)),
        expectation);
    });
  });
});
