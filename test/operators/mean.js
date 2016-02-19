export default (aeroflow, assert) => describe('#mean', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.mean));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.mean(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.mean().run(fail, done))));

    it('Emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).mean().run(done, fail)),
        expectation);
    });

    it('Emits mean value of @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 4, 5], expectation = 4;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).mean().run(done, fail)),
        expectation);
    });

    it('Emits @value from flow emitting single non-numeric @value', () => {
      const value = 'a', expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).mean().run(done, fail)),
        expectation);
    });

    it('Emits mean value of @values from flow emitting several numeric @values', () => {
      const values = ['a', 'd', 'f', 'm'], expectation = 'f';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).mean().run(done, fail)),
        expectation);
    });
  });
});