export default (aeroflow, assert) => describe('average', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.average));

  describe('average()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.average(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.average().run(fail, done))));

    it('Emits @value when flow emits single numeric @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).average().run(done, fail)),
        value);
    });

    it('Emits NaN when flow emits single not numeric @value', () =>
      assert.eventually.isNaN(new Promise((done, fail) =>
        aeroflow('test').average().run(done, fail))));

    it('Emits average of @values when flow emits several numeric @values', () => {
      const values = [1, 3, 2],
        expectation = values.reduce((sum, value) => sum + value, 0) / values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)),
        expectation);
    });

    it('Emits NaN when flow emits several not numeric @values', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('a', 'b').average().run(done, fail))));
  });
});
