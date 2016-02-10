export default (aeroflow, assert) => describe('Aeroflow#max', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.max);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
    });

    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.max().run(fail, done)));
    });

    it('emits @value from flow emitting single @value', () => {
      const expectation = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).max().run(done, fail)),
        expectation);
    });

    it('emits maximum from @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.max(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });
  });

});
