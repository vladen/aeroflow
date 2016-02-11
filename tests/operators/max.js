export default (aeroflow, assert) => describe('max', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.max);
  });

  describe('aeroflow().max()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
    });

    it('Emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.max().run(fail, done)));
    });

    it('Emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        expectation);
    });

    it('Emits @value from flow emitting single non-numeric @value', () => {
      const value = 'test', expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        expectation);
    });

    it('Emits maximum of @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.max(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });

    it('Emits maximum of @values from flow emitting several non-numeric @values', () => {
      const values = ['a', 'c', 'b'], expectation = values.reduce((max, value) => value > max ? value : max);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });
  });
});
