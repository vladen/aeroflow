export default (aeroflow, assert) => describe('min', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.min));

  describe('min()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.min(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.min().run(fail, done))));

    it('Emits @value when flow emits single numeric @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).min().run(done, fail)),
        value);
    });

    it('Emits @value when flow emits single string @value', () => {
      const value = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).min().run(done, fail)),
        value);
    });

    it('Emits minimum of @values when flow emits several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.min(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });

    it('Emits minimum of @values when flow emits several string @values', () => {
      const values = ['a', 'c', 'b'], expectation = values.reduce((min, value) => value < min ? value : min);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });
  });
});
