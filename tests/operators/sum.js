export default (aeroflow, assert) => describe('sum', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.sum);
  });

  describe('sum()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.sum(), 'Aeroflow'));

    it('Emits nothing from empty flow', () => 
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.sum().run(fail, done))));

    it('Emits sum of @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = values.reduce((prev, curr) => prev + curr, 0);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).sum().run(done, fail)),
        expectation);
    });

    it('Emits NaN from flow emitting several non-numeric @values', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('q', 'b').sum().run(done, fail))));
  });

  describe('sum(true)', () => {
    it('Emits sum when flow is empty', () => {
      const expectation = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.sum(true).run(done, fail)),
        expectation);
    });
  });
});