export default (aeroflow, assert) => describe('Aeroflow#average', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.average);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
    });

    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.average().run(fail, done)));
    });

    it('emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).average().run(done, fail)),
        expectation);
    });

    it('emits NaN from flow emitting single non-numeric @value', () => {
      const value = 'test';
      return assert.eventually.isNaN(new Promise((done, fail) =>
        aeroflow(value).average().run(done, fail)));
    });

    it('emits average from @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = values.reduce((sum, value) => sum + value, 0) / values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)),
        expectation);
    });

    it('emits NaN from @values from flow emitting several non-numeric @values', () => {
      const values = ['a', 'b'];
      return assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)));
    });
  });

});
