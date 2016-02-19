export default (aeroflow, assert) => describe('#sum', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.sum));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.sum(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.sum().run(fail, done))));

    it('Emits total sum of values when flow emits several numeric values', () => {
      const values = [1, 3, 2], expectation = values.reduce((prev, curr) => prev + curr, 0);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).sum().run(done, fail)),
        expectation);
    });

    it('Emits NaN when flow emits single not numeric value', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('q').sum().run(done, fail))));

    it('Emits NaN when flow emits several not numeric values', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('q', 'b').sum().run(done, fail))));
  });
});