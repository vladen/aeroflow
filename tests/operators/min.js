export default (aeroflow, assert) => describe('Aeroflow#min', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.min);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
    });

    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.min().run(fail, done)));
    });

    it('emits @value from flow emitting single @value', () => {
      const expectation = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).min().run(done, fail)),
        expectation);
    });

    it('emits maximum from @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.min(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });
  });

});
